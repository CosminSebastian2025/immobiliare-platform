import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendNewMessageEmail } from '@/lib/email'

const messageSchema = z.object({
    receiverId: z.string(),
    content: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const validated = messageSchema.parse(body)

        // Verifica che il receiver esista
        const receiver = await prisma.user.findUnique({
            where: { id: validated.receiverId },
        })

        if (!receiver) {
            return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
        }

        // Crea messaggio
        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId: validated.receiverId,
                content: validated.content,
            },
            include: {
                sender: { select: { id: true, name: true, email: true, image: true } },
            },
        })

        // Crea notifica
        await prisma.notification.create({
            data: {
                userId: validated.receiverId,
                type: 'MESSAGE_RECEIVED',
                title: 'Nuovo messaggio',
                body: validated.content.slice(0, 100),
                link: `/dashboard/messages/${session.user.id}`,
            },
        })

        // Invia email (async, non blocca la risposta)
        sendNewMessageEmail(receiver, session.user, validated.content).catch((err) =>
            console.error('Email error:', err)
        )

        return NextResponse.json(message, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        console.error('Message error:', error)
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
    }
}