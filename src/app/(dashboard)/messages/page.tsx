import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ConversationsList } from '@/components/messages/conversations-list'

export default async function MessagesPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const userId = session.user.id

    // Ottieni tutte le conversazioni uniche
    const allMessages = await prisma.message.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
            sender: { select: { id: true, name: true, email: true, image: true } },
            receiver: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
    })

    // Raggruppa per conversazione
    const conversationMap = new Map()

    allMessages.forEach((msg) => {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
        const existing = conversationMap.get(otherUser.id)

        if (!existing || msg.createdAt > existing.lastMessage.createdAt) {
            conversationMap.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg,
                unread: msg.receiverId === userId && !msg.read ? 1 : 0,
            })
        } else if (msg.receiverId === userId && !msg.read) {
            existing.unread++
        }
    })

    const conversations = Array.from(conversationMap.values()).sort(
        (a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Messaggi</h1>
                <ConversationsList conversations={conversations} currentUserId={userId} />
            </div>
        </div>
    )
}