'use client'

import { Home, Eye, MessageSquare, Heart, FileText, Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
    totalListings: number
    activeListings: number
    draftListings: number
    totalViews: number
    totalInquiries: number
    pendingInquiries: number
    totalFavorites: number
}

export function DashboardStats(props: Props) {
    const stats = [
        {
            label: 'Annunci totali',
            value: props.totalListings,
            icon: Home,
            color: 'bg-blue-100 text-blue-600',
            trend: '+2',
            trendUp: true,
        },
        {
            label: 'Annunci attivi',
            value: props.activeListings,
            icon: TrendingUp,
            color: 'bg-green-100 text-green-600',
            trend: '+1',
            trendUp: true,
        },
        {
            label: 'Bozze',
            value: props.draftListings,
            icon: FileText,
            color: 'bg-amber-100 text-amber-600',
        },
        {
            label: 'Visualizzazioni',
            value: props.totalViews,
            icon: Eye,
            color: 'bg-purple-100 text-purple-600',
            trend: '+12%',
            trendUp: true,
        },
        {
            label: 'Richieste totali',
            value: props.totalInquiries,
            icon: MessageSquare,
            color: 'bg-indigo-100 text-indigo-600',
            trend: '+5',
            trendUp: true,
        },
        {
            label: 'In sospeso',
            value: props.pendingInquiries,
            icon: Clock,
            color: 'bg-orange-100 text-orange-600',
            highlight: props.pendingInquiries > 0,
        },
        {
            label: 'Preferiti ricevuti',
            value: props.totalFavorites,
            icon: Heart,
            color: 'bg-pink-100 text-pink-600',
        },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow ${
                        stat.highlight ? 'ring-2 ring-orange-200' : ''
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        {stat.trend && (
                            <span
                                className={`text-xs font-medium flex items-center gap-0.5 ${
                                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend}
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString('it-IT')}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
            ))}
        </div>
    )
}