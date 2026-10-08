import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentListings } from '@/components/dashboard/recent-listings'
import { RecentInquiries } from '@/components/dashboard/recent-inquiries'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null

    const userId = session.user.id

    // Statistiche
    const [totalListings, activeListings, totalViews, pendingInquiries] = await Promise.all([
        prisma.listing.count({ where: { userId } }),
        prisma.listing.count({ where: { userId, status: 'PUBLISHED' } }),
        prisma.listing.aggregate({ where: { userId }, _sum: { views: true } }),
        prisma.inquiry.count({ where: { receiverId: userId, status: 'PENDING' } }),
    ])

    // Annunci recenti
    const recentListings = await prisma.listing.findMany({
        where: { userId },
        include: { photos: { where: { isCover: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    // Richieste recenti
    const recentInquiries = await prisma.inquiry.findMany({
        where: { receiverId: userId },
        include: { listing: true, sender: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Bentornato, {session.user.name}</p>
                </div>
                <Link
                    href="/listings/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nuovo annuncio
                </Link>
            </div>

            {/* Statistiche */}
            <StatsCards
                totalListings={totalListings}
                activeListings={activeListings}
                totalViews={totalViews._sum.views || 0}
                pendingInquiries={pendingInquiries}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Annunci recenti */}
                <RecentListings listings={recentListings} />

                {/* Richieste recenti */}
                <RecentInquiries inquiries={recentInquiries} />
            </div>
        </div>
    )
}