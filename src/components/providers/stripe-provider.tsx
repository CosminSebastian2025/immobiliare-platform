'use client'

import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeProvider({children, clientSecret}: {
    children: React.ReactNode
    clientSecret?: string
}) {
    const options = clientSecret ? {clientSecret} : {}

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    )
}