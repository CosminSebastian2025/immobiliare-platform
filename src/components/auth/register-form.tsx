'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

type UserRole = 'PRIVATE' | 'AGENCY'

export function RegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PRIVATE' as UserRole,
        phone: '',
        agencyName: '',
        vatNumber: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Le password non coincidono')
            return
        }

        if (formData.password.length < 8) {
            setError('La password deve avere almeno 8 caratteri')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Errore durante la registrazione')
                setLoading(false)
                return
            }

            router.push('/login?registered=true')
        } catch {
            setError('Si è verificato un errore. Riprova.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
            )}

            {/* Tipo account */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Tipo di account</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, role: 'PRIVATE' }))}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            formData.role === 'PRIVATE'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        🏠 Privato
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, role: 'AGENCY' }))}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            formData.role === 'AGENCY'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        🏢 Agenzia
                    </button>
                </div>
            </div>

            {/* Nome */}
            <div>
                <label className="block text-sm font-medium mb-1.5">
                    {formData.role === 'AGENCY' ? 'Nome del referente' : 'Nome e cognome'}
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Mario Rossi"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Dati agenzia (se role = AGENCY) */}
            {formData.role === 'AGENCY' && (
                <>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Nome agenzia</label>
                        <input
                            type="text"
                            name="agencyName"
                            value={formData.agencyName}
                            onChange={handleChange}
                            placeholder="Immobiliare Rossi"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Partita IVA</label>
                        <input
                            type="text"
                            name="vatNumber"
                            value={formData.vatNumber}
                            onChange={handleChange}
                            placeholder="01234567890"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </>
            )}

            {/* Email */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tua@email.it"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Telefono */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Telefono</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+39 333 123 4567"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimo 8 caratteri"
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Conferma password */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Conferma password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ripeti la password"
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
                Crea account
            </button>

            <p className="text-xs text-gray-500 text-center">
                Registrandoti accetti i{' '}
                <a href="/termini" className="text-blue-600 hover:underline">Termini di servizio</a>
                {' '}e la{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
        </form>
    )
}