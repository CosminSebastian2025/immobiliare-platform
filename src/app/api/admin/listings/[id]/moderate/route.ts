import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendModerationEmail } from '@/lib/email'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, reason } = await req.json()
    const { id } = params

    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { user: true },
        })

        if (!listing) {
            return NextResponse.json({ error: 'Annuncio non trovato' }, { status: 404 })
        }

        let newStatus: string
        switch (action) {
            case 'approve':
                newStatus = 'PUBLISHED'
                break
            case 'reject':
                newStatus = 'REJECTED'
                break
            case 'report':
                newStatus = 'ARCHIVED'
                break
            default:
                return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
        }

        await prisma.listing.update({
            where: { id },
            data: {
                status: newStatus as any,
                publishedAt: action === 'approve' ? new Date() : null,
            },
        })

        // Notifica utente
        await prisma.notification.create({
            data: {
                userId: listing.userId,
                type: action === 'approve' ? 'LISTING_APPROVED' : 'LISTING_REJECTED',
                title: action === 'approve'
                    ? 'Annuncio approvato ✓'
                    : 'Annuncio rifiutato',
                body: action === 'approve'
                    ? `Il tuo annuncio "${listing.title}" è stato approvato ed è ora visibile.`
                    : `Il tuo annuncio "${listing.title}" è stato rifiutato. ${reason ? `Motivo: ${reason}` : ''}`,
                link: `/dashboard/listings/${id}`,
            },
        })

        // Invia email
        await sendModerationEmail(listing, action, reason)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Moderation error:', error)
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
    }
}