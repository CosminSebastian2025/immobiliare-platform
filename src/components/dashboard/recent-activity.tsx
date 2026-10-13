import Link from 'next/link'
import { MessageSquare, FileText, Bell, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Props {
    listings: any[]
    inquiries: any[]
    notifications: any[]
}

export function RecentActivity({ listings, inquiries, notifications }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Annunci recenti */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Annunci recenti
                    </h3>
                    <Link href="/dashboard/listings" className="text-sm text-blue-600 hover:underline">
                        Vedi tutti
                    </Link>
                </div>
                <div className="space-y-3">
                    {listings.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nessun annuncio</p>
                    ) : (
                        listings.map((listing) => (
                            <Link
                                key={listing.id}
                                href={`/listing/${listing.slug}`}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                            >
                                {listing.photos[0]?.url ? (
                                    <img
                                        src={listing.photos[0].url}
                                        alt={listing.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-100" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(listing.createdAt), {
                                            addSuffix: true,
                                            locale: it,
                                        })}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        listing.status === 'PUBLISHED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}
                                >
                  {listing.status === 'PUBLISHED' ? 'Attivo' : 'Bozza'}
                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Richieste recenti */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Richieste recenti
                    </h3>
                    <Link href="/dashboard/messages" className="text-sm text-blue-600 hover:underline">
                        Vedi tutte
                    </Link>
                </div>
                <div className="space-y-3">
                    {inquiries.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nessuna richiesta</p>
                    ) : (
                        inquiries.map((inquiry) => (
                            <Link
                                key={inquiry.id}
                                href={`/dashboard/messages/${inquiry.id}`}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                            >
                                {inquiry.sender.image ? (
                                    <img
                                        src={inquiry.sender.image}
                                        alt={inquiry.sender.name || ''}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {inquiry.sender.name?.[0] || inquiry.sender.email[0].toUpperCase()}
                    </span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{inquiry.sender.name || inquiry.sender.email}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                        Su: {inquiry.listing.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDistanceToNow(new Date(inquiry.createdAt), {
                                            addSuffix: true,
                                            locale: it,
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Notifiche */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifiche recenti
                    </h3>
                    <Link href="/dashboard/notifications" className="text-sm text-blue-600 hover:underline">
                        Vedi tutte
                    </Link>
                </div>
                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nessuna notifica</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 rounded-lg ${
                                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-600'
                                }`}
                            >
                                <p className="text-sm font-medium">{notification.title}</p>
                                {notification.body && (
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.body}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                        addSuffix: true,
                                        locale: it,
                                    })}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}