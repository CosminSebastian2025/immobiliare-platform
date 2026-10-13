'use client'

import {useState} from 'react'
import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {CreditCard, Loader2, Lock} from 'lucide-react'

interface Props {
    subscriptionId: string
    planName: string
}

export function CheckoutForm({subscriptionId, planName}: Props) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setLoading(true)
        setError(null)

        const {error: submitError} = await elements.submit()
        if (submitError) {
            setError(submitError.message || 'Errore')
            setLoading(false)
            return
        }

        const {error: confirmError} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard?success=true&subscription=${subscriptionId}`,
            },
            redirect: 'if_required',
        })

        if (confirmError) {
            setError(confirmError.message || 'Errore nel pagamento')
            setLoading(false)
        } else {
            setMessage('Pagamento completato! Reindirizzamento...')
            // La pagina reindirizzerà automaticamente
            setTimeout(() => {
                window.location.href = `/dashboard?success=true`
            }, 2000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-green-600"/>
                <span className="text-sm text-gray-600">Pagamento sicuro con crittografia SSL</span>
            </div>

            <PaymentElement
                options={{
                    layout: 'tabs',
                    defaultValues: {billingDetails: {name: ''}}
                }}
            />

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {message && (
                <div className="mt-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin"/>
                        Elaborazione...
                    </>
                ) : (
                    <>
                        <CreditCard className="h-5 w-5"/>
                        Abbonati a {planName}
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
                Pagando accetti i termini di servizio. Puoi cancellare in qualsiasi momento.
            </p>
        </form>
    )
}