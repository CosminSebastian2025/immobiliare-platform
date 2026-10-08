import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { GoogleButton } from '@/components/auth/google-button'

export const metadata: Metadata = {
    title: 'Registrati',
}

export default function RegisterPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Crea il tuo account</h1>
                <p className="text-gray-500 mt-2">
                    Pubblica annunci o trova la tua prossima casa
                </p>
            </div>

            <GoogleButton />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">oppure</span>
                </div>
            </div>

            <RegisterForm />

            <p className="mt-6 text-center text-sm text-gray-500">
                Hai già un account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Accedi
                </Link>
            </p>
        </div>
    )
}