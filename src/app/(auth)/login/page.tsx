import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'
import GoogleButton from '@/components/auth/google-button'

export const metadata: Metadata = {
    title: 'Accedi',
    description: 'Accedi al tuo account',
}

export default function LoginPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Bentornato</h1>
                <p className="text-gray-500 mt-2">Accedi al tuo account</p>
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

            <LoginForm />

            <div className="mt-6 text-center space-y-2">
                <Link href="/reset-password" className="block text-sm text-blue-600 hover:underline">
                    Password dimenticata?
                </Link>
                <p className="text-sm text-gray-500">
                    Non hai un account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                        Registrati
                    </Link>
                </p>
            </div>
        </div>
    )
}