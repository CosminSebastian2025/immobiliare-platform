'use client'

import { useState } from 'react'
import { MoreVertical, Shield, Ban, CheckCircle, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Props {
    users: any[]
    total: number
    page: number
    perPage: number
}

export function UsersTable({ users, total, page, perPage }: Props) {
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    const handleAction = async (userId: string, action: string) => {
        if (!confirm(`Confermi l'azione: ${action}?`)) return

        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
        })

        if (res.ok) {
            window.location.reload()
        } else {
            alert('Errore durante l\'operazione')
        }
    }

    const totalPages = Math.ceil(total / perPage)

    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Utente</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Ruolo</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Stato</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Annunci</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Piano</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Registrato</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Azioni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || ''}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">
                                            {user.name || 'Senza nome'}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                        {user.profile?.agencyName && (
                                            <p className="text-xs text-gray-400">{user.profile.agencyName}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                  <span
                      className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : user.role === 'AGENCY'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {user.role === 'ADMIN' ? 'Admin' : user.role === 'AGENCY' ? 'Agenzia' : 'Privato'}
                  </span>
                            </td>
                            <td className="py-3 px-4">
                  <span
                      className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : user.status === 'SUSPENDED'
                                  ? 'bg-amber-100 text-amber-700'
                                  : user.status === 'BANNED'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {user.status === 'ACTIVE' ? 'Attivo' :
                        user.status === 'SUSPENDED' ? 'Sospeso' :
                            user.status === 'BANNED' ? 'Bannato' : 'In attesa'}
                  </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                                <span className="font-medium">{user._count.listings}</span>
                                <span className="text-gray-400"> · {user._count.inquiriesReceived} rich.</span>
                            </td>
                            <td className="py-3 px-4">
                                {user.subscription ? (
                                    <span className="text-xs font-medium text-blue-600">
                      {user.subscription.plan.name}
                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">-</span>
                                )}
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-500">
                                {formatDistanceToNow(new Date(user.createdAt), {
                                    addSuffix: true,
                                    locale: it,
                                })}
                            </td>
                            <td className="py-3 px-4 text-right relative">
                                <button
                                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>

                                {openMenu === user.id && (
                                    <div className="absolute right-4 top-12 bg-white border rounded-lg shadow-lg py-1 w-48 z-10">
                                        <button
                                            onClick={() => {
                                                setOpenMenu(null)
                                                window.open(`/admin/users/${user.id}`, '_blank')
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" /> Vedi dettagli
                                        </button>
                                        {user.status !== 'ACTIVE' && (
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null)
                                                    handleAction(user.id, 'activate')
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                            >
                                                <CheckCircle className="h-4 w-4" /> Attiva
                                            </button>
                                        )}
                                        {user.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null)
                                                    handleAction(user.id, 'suspend')
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600"
                                            >
                                                <Ban className="h-4 w-4" /> Sospendi
                                            </button>
                                        )}
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null)
                                                    handleAction(user.id, 'ban')
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                            >
                                                <Shield className="h-4 w-4" /> Banna
                                            </button>
                                        )}
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null)
                                                    handleAction(user.id, 'promote')
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-purple-600"
                                            >
                                                <Shield className="h-4 w-4" /> Promuovi a Admin
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Paginazione */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                    <p className="text-sm text-gray-500">
                        Pagina {page} di {totalPages}
                    </p>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <a
                                href={`?page=${page - 1}`}
                                className="px-3 py-1 text-sm border rounded hover:bg-white"
                            >
                                Precedente
                            </a>
                        )}
                        {page < totalPages && (
                            <a
                                href={`?page=${page + 1}`}
                                className="px-3 py-1 text-sm border rounded hover:bg-white"
                            >
                                Successiva
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}