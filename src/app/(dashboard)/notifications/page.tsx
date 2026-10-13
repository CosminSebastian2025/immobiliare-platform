import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { NotificationsList } from '@/components/notifications/notifications-list'

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
    })

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Notifiche</h1>
                        <p className="text-gray-500 mt-1">
                            {unreadCount > 0 ? `${unreadCount} non lette` : 'Tutte lette'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <form action="/api/notifications/mark-all-read" method="POST">
                            <button className="text-sm text-blue-600 hover:underline">
                                Segna tutte come lette
                            </button>
                        </form>
                    )}
                </div>

                <NotificationsList notifications={notifications} />
            </div>
        </div>
    )
}