import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

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
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            await handleCheckoutCompleted(session)
            break
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription
            await handleSubscriptionUpdated(subscription)
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            await handleSubscriptionDeleted(subscription)
            break
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice
            await handlePaymentSucceeded(invoice)
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            await handlePaymentFailed(invoice)
            break
        }
    }

    return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id
    const subscriptionId = session.subscription as string

    if (!userId) return

    // Recupera la subscription da Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Aggiorna il database
    await prisma.subscription.update({
        where: { userId },
        data: {
            stripeSubscriptionId: subscriptionId,
            status: 'ACTIVE',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        },
    })

    // Registra pagamento
    await prisma.payment.create({
        data: {
            userId,
            amount: session.amount_total || 0,
            currency: session.currency || 'eur',
            status: 'COMPLETED',
            stripePaymentIntentId: session.payment_intent as string,
            description: 'Abbonamento',
        },
    })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
            status: subscription.status === 'active' ? 'ACTIVE' :
                subscription.status === 'past_due' ? 'PAST_DUE' :
                    subscription.status === 'canceled' ? 'CANCELLED' :
                        subscription.status === 'trialing' ? 'TRIALING' : 'INCOMPLETE',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        },
    })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
        },
    })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string

    const subscription = await prisma.subscription.findUnique({
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
                description: `Rinnovo abbonamento`,
            },
        })
    }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string

    await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: { status: 'PAST_DUE' },
    })
}