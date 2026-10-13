import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'
import {authOptions} from '@/lib/auth'
import {stripe} from '@/lib/stripe'
import {prisma} from '@/lib/prisma'
import {CheckoutForm} from '@/components/stripe/checkout-form'
import {StripeProvider} from '@/components/providers/stripe-provider'

interface Props {
    searchParams: { planId: string; interval: 'monthly' | 'yearly' }
}

export default async function CheckoutPage({searchParams}: Props) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login?callbackUrl=/checkout')

    const plan = await prisma.plan.findUnique({
        where: {id: searchParams.planId},
    })

    if (!plan) redirect('/pricing')

    // Crea Stripe customer se non esiste
    let subscription = await prisma.subscription.findUnique({
        where: {userId: session.user.id},
    })

    let stripeCustomerId = subscription?.stripeCustomerId

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: session.user.email!,
            name: session.user.name || undefined,
            metadata: {userId: session.user.id},
        })
        stripeCustomerId = customer.id
    }

    // Crea PaymentIntent o SetupIntent
    const priceId = searchParams.interval === 'yearly'
        ? plan.stripePriceYearly
        : plan.stripePriceMonthly

    // Crea subscription con trial di 14 giorni opzionale
    const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{price: priceId!}],
        payment_behavior: 'default_incomplete',
        payment_settings: {save_default_payment_method: 'on_subscription'},
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 14, // Trial gratuito
        metadata: {
            userId: session.user.id,
            planId: plan.id,
        },
    })

    const clientSecret = (stripeSubscription.latest_invoice as any)
        ?.payment_intent?.client_secret

    if (!clientSecret) redirect('/pricing')

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Completa l'abbonamento</h1>

            <div className="bg-white rounded-xl border p-6 mb-6">
                <h2 className="font-semibold mb-3">{plan.name}</h2>
                <p className="text-gray-600 mb-2">{plan.description}</p>
                <p className="text-2xl font-bold text-blue-600">
                    €{(searchParams.interval === 'yearly' ? plan.priceYearly : plan.priceMonthly) / 100}
                    <span className="text-sm font-normal text-gray-500">
                        /{searchParams.interval === 'yearly' ? 'anno' : 'mese'}
                    </span>
                </p>
                <p className="text-sm text-green-600 mt-2">
                    ✓ 14 giorni di prova gratuita
                </p>
            </div>

            <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                    subscriptionId={stripeSubscription.id}
                    planName={plan.name}
                />
            </StripeProvider>
        </div>
    )
}