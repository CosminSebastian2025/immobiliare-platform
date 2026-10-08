import { Home, Eye, MessageSquare, TrendingUp } from 'lucide-react'

interface Props {
    totalListings: number
    activeListings: number
    totalViews: number
    pendingInquiries: number
}

export function StatsCards({ totalListings, activeListings, totalViews, pendingInquiries }: Props) {
    const stats = [
        {
            label: 'Annunci totali',
            value: totalListings,
            icon: Home,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Annunci attivi',
            value: activeListings,
            icon: TrendingUp,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Visualizzazioni totali',
            value: totalViews,
            icon: Eye,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            label: 'Richieste in sospeso',
            value: pendingInquiries,
            icon: MessageSquare,
            color: 'bg-amber-100 text-amber-600',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border p-5">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
            ))}
        </div>
    )
}