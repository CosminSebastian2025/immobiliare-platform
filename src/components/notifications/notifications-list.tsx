'use client'

import { Bell, MessageSquare, Heart, CheckCircle, XCircle, Package } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Props {
    notifications: any[]
}

const iconMap: Record<string, any> = {
    INQUIRY_RECEIVED: MessageSquare,
    MESSAGE_RECEIVED: MessageSquare,
    LISTING_APPROVED: CheckCircle,
    LISTING_REJECTED: XCircle,
    SUBSCRIPTION_EXPIRING: Package,
    FAVORITE_PRICE_DROP: Heart,
    SYSTEM: Bell,
}

const colorMap: Record<string, string> = {
    INQUIRY_RECEIVED: 'bg-blue-100 text-blue-600',
    MESSAGE_RECEIVED: 'bg-indigo-100 text-indigo-600',
    LISTING_APPROVED: 'bg-green-100 text-green-600',
    LISTING_REJECTED: 'bg-red-100 text-red-600',
    SUBSCRIPTION_EXPIRING: 'bg-amber-100 text-amber-600',
    FAVORITE_PRICE_DROP: 'bg-pink-100 text-pink-600',
    SYSTEM: 'bg-gray-100 text-gray-600',
}

export function NotificationsList({ notifications }: Props) {
    const handleMarkRead = async (id: string) => {
        await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    }

    if (notifications.length === 0) {
        return (
            <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nessuna notifica</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border divide-y">
            {notifications.map((notification) => {
                const Icon = iconMap[notification.type] || Bell
                const colorClass = colorMap[notification.type] || colorMap.SYSTEM

                return (
                    <div
                        key={notification.id}
                        className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            {notification.link ? (
                                <Link href={notification.link} className="block">
                                    <p className={`font-medium ${!notification.read ? 'text-blue-900' : ''}`}>
                                        {notification.title}
                                    </p>
                                    {notification.body && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {notification.body}
                                        </p>
                                    )}
                                </Link>
                            ) : (
                                <>
                                    <p className="font-medium">{notification.title}</p>
                                    {notification.body && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {notification.body}
                                        </p>
                                    )}
                                </>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: it,
                                })}
                            </p>
                        </div>

                        {!notification.read && (
                            <button
                                onClick={() => handleMarkRead(notification.id)}
                                className="text-xs text-blue-600 hover:underline self-start"
                            >
                                Segna letta
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}