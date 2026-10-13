import Link from 'next/link'
import { Plus, FileEdit, BarChart3, CreditCard, Settings, Bell } from 'lucide-react'

export function QuickActions() {
    const actions = [
        {
            title: 'Nuovo annuncio',
            description: 'Pubblica un immobile',
            icon: Plus,
            href: '/listings/new',
            color: 'bg-blue-600 hover:bg-blue-700',
            primary: true,
        },
        {
            title: 'I miei annunci',
            description: 'Gestisci e modifica',
            icon: FileEdit,
            href: '/dashboard/listings',
            color: 'bg-white border hover:bg-gray-50',
        },
        {
            title: 'Statistiche',
            description: 'Report dettagliati',
            icon: BarChart3,
            href: '/dashboard/analytics',
            color: 'bg-white border hover:bg-gray-50',
        },
        {
            title: 'Abbonamento',
            description: 'Gestisci il tuo piano',
            icon: CreditCard,
            href: '/dashboard/subscription',
            color: 'bg-white border hover:bg-gray-50',
        },
        {
            title: 'Notifiche',
            description: 'Messaggi e avvisi',
            icon: Bell,
            href: '/dashboard/notifications',
            color: 'bg-white border hover:bg-gray-50',
        },
        {
            title: 'Impostazioni',
            description: 'Profilo e preferenze',
            icon: Settings,
            href: '/dashboard/settings',
            color: 'bg-white border hover:bg-gray-50',
        },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {actions.map((action) => (
                <Link
                    key={action.title}
                    href={action.href}
                    className={`${action.color} ${
                        action.primary ? 'text-white' : 'text-gray-900'
                    } rounded-xl p-4 transition-all hover:shadow-md group`}
                >
                    <action.icon className={`h-6 w-6 mb-2 ${action.primary ? 'text-white' : 'text-gray-600'}`} />
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className={`text-xs mt-1 ${action.primary ? 'text-blue-100' : 'text-gray-500'}`}>
                        {action.description}
                    </p>
                </Link>
            ))}
        </div>
    )
}