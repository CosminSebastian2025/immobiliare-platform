import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}))

// Mock bcrypt
vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
    },
}))

describe('POST /api/auth/register', () => {
    const { prisma } = await import('@/lib/prisma')

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('crea un nuovo utente con successo', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
        vi.mocked(prisma.user.create).mockResolvedValue({
            id: '1',
            email: 'test@test.it',
        } as any)

        const request = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@test.it',
                password: 'password123',
                role: 'PRIVATE',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.message).toBe('Registrazione completata')
        expect(prisma.user.create).toHaveBeenCalled()
    })

    it('rifiuta email già esistente', async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1' } as any)

        const request = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test User',
                email: 'existing@test.it',
                password: 'password123',
                role: 'PRIVATE',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(409)
        expect(data.message).toBe('Email già registrata')
    })

    it('valida email', async () => {
        const request = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test',
                email: 'invalid-email',
                password: 'password123',
                role: 'PRIVATE',
            }),
        })

        const response = await POST(request)
        expect(response.status).toBe(400)
    })

    it('richiede password di almeno 8 caratteri', async () => {
        const request = new NextRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test',
                email: 'test@test.it',
                password: 'short',
                role: 'PRIVATE',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.message).toContain('8 caratteri')
    })
})