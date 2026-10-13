import {NextRequest, NextResponse} from 'next/server'
import {stripe} from '@/lib/stripe'
import {prisma} from '@/lib/prisma'
import Stripe from 'stripe'
import {sendPaymentFailedEmail, sendSubscriptionEmail} from '@/lib/email'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('Webhook error:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
                break

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
                break

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object as Stripe.Invoice)
                break

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.Invoice)
                break

            case 'invoice.payment_action_required':
                await handlePaymentActionRequired(event.data.object as Stripe.Invoice)
                break

            case 'customer.subscription.trial_will_end':
                await handleTrialEnding(event.data.object as Stripe.Subscription)
                break
        }

        return NextResponse.json({received: true})
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({error: 'Processing error'}, {status: 500})
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId
    if (!userId) return

    const subscriptionId = session.subscription as string
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)

    await prisma.subscription.update({
        where: { userId },
        data: {
            stripeSubscriptionId: subscriptionId,
            status: 'ACTIVE',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            trialEnd: stripeSubscription.trial_end
                ? new Date(stripeSubscription.trial_end * 1000)
                : null,
        },
    })

    const user = await prisma.user.findUnique({where: {id: userId}})
    if (user) {
        await sendSubscriptionEmail(user, {name: 'Premium'})
    }
}

async function handleSubscriptionCreated(sub: Stripe.Subscription) {
    await prisma.subscription.updateMany({
        where: {stripeSubscriptionId: sub.id},
        data: {
            status: sub.status === 'active' ? 'ACTIVE' : 'TRIALING',
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
    })
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
    const statusMap: Record<string, any> = {
        active: 'ACTIVE',
        past_due: 'PAST_DUE',
        canceled: 'CANCELLED',
        trialing: 'TRIALING',
        incomplete: 'INCOMPLETE',
    }

    await prisma.subscription.updateMany({
        where: {stripeSubscriptionId: sub.id},
        data: {
            status: statusMap[sub.status] || 'ACTIVE',
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
        },
    })
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
    await prisma.subscription.updateMany({
        where: {stripeSubscriptionId: sub.id},
        data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
        },
    })
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string
    const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscriptionId },
    })

    if (subscription) {
        await prisma.payment.create({
            data: {
                userId: subscription.userId,
                subscriptionId: subscription.id,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'COMPLETED',
                stripePaymentIntentId: invoice.payment_intent as string,
                description: `Pagamento fattura ${invoice.number}`,
            },
        })

        // Crea notifica
        await prisma.notification.create({
            data: {
                userId: subscription.userId,
                type: 'SYSTEM',
                title: 'Pagamento confermato',
                body: `Il tuo pagamento di €${(invoice.amount_paid / 100).toFixed(2)} è stato confermato`,
            },
        })
    }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string
    const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscriptionId },
    })

    if (subscription) {
        await prisma.subscription.update({
            where: {id: subscription.id},
            data: {status: 'PAST_DUE'},
        })

        const user = await prisma.user.findUnique({
            where: {id: subscription.userId},
        })

        if (user) {
            await sendPaymentFailedEmail(user, invoice)
        }

        await prisma.notification.create({
            data: {
                userId: subscription.userId,
                type: 'SUBSCRIPTION_EXPIRING',
                title: '⚠️ Problema con il pagamento',
                body: 'Il tuo pagamento non è andato a buon fine. Aggiorna il metodo di pagamento.',
                link: '/dashboard/subscription',
            },
        })
    }
}

async function handlePaymentActionRequired(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string
    const subscription = await prisma.subscription.findFirst({
        where: {stripeSubscriptionId: subscriptionId},
    })

    if (subscription) {
        await prisma.notification.create({
            data: {
                userId: subscription.userId,
                type: 'SUBSCRIPTION_EXPIRING',
                title: 'Azione richiesta',
                body: 'Il tuo pagamento richiede autenticazione 3D Secure. Completa la verifica.',
                link: '/dashboard/subscription',
            },
        })
    }
}

async function handleTrialEnding(sub: Stripe.Subscription) {
    const subscription = await prisma.subscription.findFirst({
        where: {stripeSubscriptionId: sub.id},
    })

    if (subscription) {
        await prisma.notification.create({
            data: {
                userId: subscription.userId,
                type: 'SUBSCRIPTION_EXPIRING',
                title: 'La tua prova sta per scadere',
                body: `Il tuo periodo di prova terminerà tra 3 giorni. L'abbonamento verrà rinnovato automaticamente.`,
                link: '/dashboard/subscription',
            },
        })
    }
}