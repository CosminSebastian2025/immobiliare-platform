import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ChatWindow } from '@/components/messages/chat-window'

interface Props {
    params: { userId: string }
}

export default async function ConversationPage({ params }: Props) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const currentUserId = session.user.id
    const otherUserId = params.userId

    if (currentUserId === otherUserId) notFound()

    // Recupera l'altro utente
    const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, name: true, email: true, image: true, role: true },
    })

    if (!otherUser) notFound()

    // Recupera tutti i messaggi della conversazione
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        },
        orderBy: { createdAt: 'asc' },
    })

    // Segna come letti i messaggi ricevuti
    await prisma.message.updateMany({
        where: {
            senderId: otherUserId,
            receiverId: currentUserId,
            read: false,
        },
        data: { read: true, readAt: new Date() },
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <ChatWindow
                    messages={messages}
                    otherUser={otherUser}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    )
}