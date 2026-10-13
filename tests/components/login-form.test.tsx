import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '@/components/auth/login-form'

// Mock next-auth
const mockSignIn = vi.fn()
vi.mock('next-auth/react', () => ({
    signIn: (...args: any[]) => mockSignIn(...args),
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}))

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderizza i campi', () => {
        render(<LoginForm />)
        expect(screen.getByPlaceholderText('tua@email.it')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Accedi/i })).toBeInTheDocument()
    })

    it('mostra errore con credenziali errate', async () => {
        mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' })

        render(<LoginForm />)

        await userEvent.type(screen.getByPlaceholderText('tua@email.it'), 'test@test.it')
        await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword')

        fireEvent.click(screen.getByRole('button', { name: /Accedi/i }))

        await waitFor(() => {
            expect(screen.getByText('Email o password non corretti')).toBeInTheDocument()
        })
    })

    it('reindirizza alla dashboard con login corretto', async () => {
        mockSignIn.mockResolvedValue({ ok: true })

        render(<LoginForm />)

        await userEvent.type(screen.getByPlaceholderText('tua@email.it'), 'test@test.it')
        await userEvent.type(screen.getByPlaceholderText('••••••••'), 'correctpassword')

        fireEvent.click(screen.getByRole('button', { name: /Accedi/i }))

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('toggle password visibility', async () => {
        render(<LoginForm />)

        const passwordInput = screen.getByPlaceholderText('••••••••')
        expect(passwordInput).toHaveAttribute('type', 'password')

        const toggleButton = screen.getByRole('button', { name: '' })
        await userEvent.click(toggleButton)

        expect(passwordInput).toHaveAttribute('type', 'text')
    })
})