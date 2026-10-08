import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { planId, interval } = await req.json()

        // Trova il piano
        const plan = await prisma.plan.findUnique({ where: { id: planId } })
        if (!plan) {
            return NextResponse.json({ error: 'Piano non trovato' }, { status: 404 })
        }

        // Trova o crea il subscription dell'utente
        let subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        })

        if (!subscription) {
            subscription = await prisma.subscription.create({
                data: { userId: session.user.id, planId },
            })
        }

        // Crea checkout session Stripe
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: interval === 'yearly' ? plan.stripePriceYearly! : plan.stripePriceMonthly!,
                    quantity: 1,
                },
            ],
            customer_email: session.user.email!,
            client_reference_id: session.user.id,
            subscription_data: {
                metadata: {
                    userId: session.user.id,
                    planId: plan.id,
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        })

        // Salva stripeCustomerId
        if (checkoutSession.customer) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: { stripeCustomerId: checkoutSession.customer as string },
            })
        }

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
    }
}