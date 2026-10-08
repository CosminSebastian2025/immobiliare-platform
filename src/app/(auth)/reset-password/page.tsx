'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.message || 'Errore')
                setLoading(false)
                return
            }

            setSent(true)
        } catch {
            setError('Errore durante l\'invio. Riprova.')
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Email inviata</h1>
                <p className="text-gray-500 mb-6">
                    Se esiste un account con l'indirizzo <strong>{email}</strong>,
                    riceverai un'email con le istruzioni per reimpostare la password.
                </p>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Torna al login
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="text-gray-500 mt-2">
                    Inserisci la tua email per ricevere il link di reset
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tua@email.it"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Invia link di reset
                </button>
            </form>

            <p className="mt-6 text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:underline">
                    ← Torna al login
                </Link>
            </p>
        </div>
    )
}