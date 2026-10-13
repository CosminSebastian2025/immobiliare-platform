import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action } = await req.json()
    const { id } = params

    try {
        switch (action) {
            case 'activate':
                await prisma.user.update({
                    where: { id },
                    data: { status: 'ACTIVE' },
                })
                break

            case 'suspend':
                await prisma.user.update({
                    where: { id },
                    data: { status: 'SUSPENDED' },
                })
                break

            case 'ban':
                await prisma.user.update({
                    where: { id },
                    data: { status: 'BANNED' },
                })
                break

            case 'promote':
                await prisma.user.update({
                    where: { id },
                    data: { role: 'ADMIN' },
                })
                break

            default:
                return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
        }

        // Log audit
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: `user.${action}`,
                entity: 'user',
                entityId: id,
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Admin user action error:', error)
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
    }
}