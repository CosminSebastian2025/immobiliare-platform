import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
    name: z.string().min(2, 'Il nome deve avere almeno 2 caratteri'),
    email: z.string().email('Email non valida'),
    password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
    role: z.enum(['PRIVATE', 'AGENCY']),
    phone: z.string().optional(),
    agencyName: z.string().optional(),
    vatNumber: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validated = registerSchema.parse(body)

        // Verifica se l'email esiste già
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email già registrata' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10)

        // Crea utente con profilo
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                name: validated.name,
                role: validated.role,
                phone: validated.phone,
                profile: {
                    create: {
                        fullName: validated.name,
                        agencyName: validated.agencyName,
                        vatNumber: validated.vatNumber,
                    },
                },
            },
        })

        // TODO: Invia email di verifica

        return NextResponse.json(
            { message: 'Registrazione completata', userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: error.issues },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: 'Errore interno del server' },
            { status: 500 }
        )
    }
}