import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({ where: { email } })

        // Per sicurezza, rispondiamo sempre 200 anche se l'email non esiste
        if (!user) {
            return NextResponse.json({ message: 'Email inviata' })
        }

        // Genera token di reset
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 ora

        // Salva il token (dovresti avere una tabella per i token di reset)
        // Per ora usiamo un campo temporaneo
        await prisma.user.update({
            where: { id: user.id },
            data: {
                // Aggiungi campi resetToken e resetTokenExpiry al modello User
                // resetToken,
                // resetTokenExpiry,
            },
        })

        // TODO: Invia email con il link di reset
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`
        console.log('Reset link:', resetLink) // In produzione, invia via email

        return NextResponse.json({ message: 'Email inviata' })
    } catch {
        return NextResponse.json(
            { message: 'Errore interno' },
            { status: 500 }
        )
    }
}