import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { PerformanceOverview } from '@/components/dashboard/performance-overview'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const userId = session.user.id

    // Statistiche complete
    const [
        totalListings,
        activeListings,
        draftListings,
        totalViews,
        totalInquiries,
        pendingInquiries,
        totalFavorites,
        listingsByType,
        viewsLast30Days,
        inquiriesLast30Days,
        recentListings,
        recentInquiries,
        recentNotifications,
        topListings,
    ] = await Promise.all([
        prisma.listing.count({ where: { userId } }),
        prisma.listing.count({ where: { userId, status: 'PUBLISHED' } }),
        prisma.listing.count({ where: { userId, status: 'DRAFT' } }),
        prisma.listing.aggregate({
            where: { userId },
            _sum: { views: true },
        }),
        prisma.inquiry.count({ where: { receiverId: userId } }),
        prisma.inquiry.count({ where: { receiverId: userId, status: 'PENDING' } }),
        prisma.favorite.count({
            where: { listing: { userId } },
        }),
        prisma.listing.groupBy({
            by: ['listingType'],
            where: { userId },
            _count: true,
        }),
        getViewsLast30Days(userId),
        getInquiriesLast30Days(userId),
        prisma.listing.findMany({
            where: { userId },
            include: {
                photos: { where: { isCover: true }, take: 1 },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        prisma.inquiry.findMany({
            where: { receiverId: userId },
            include: {
                listing: { select: { title: true, slug: true } },
                sender: { select: { name: true, email: true, image: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
        prisma.listing.findMany({
            where: { userId, status: 'PUBLISHED' },
            orderBy: { views: 'desc' },
            take: 5,
        }),
    ])

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Bentornato, <span className="font-medium">{session.user.name}</span> · Panoramica delle tue attività
                </p>
            </div>

            {/* Statistiche rapide */}
            <DashboardStats
                totalListings={totalListings}
                activeListings={activeListings}
                draftListings={draftListings}
                totalViews={totalViews._sum.views || 0}
                totalInquiries={totalInquiries}
                pendingInquiries={pendingInquiries}
                totalFavorites={totalFavorites}
            />

            {/* Azioni rapide */}
            <QuickActions />

            {/* Grafici */}
            <DashboardCharts
                viewsData={viewsLast30Days}
                inquiriesData={inquiriesLast30Days}
                listingsByType={listingsByType}
            />

            {/* Performance top listings */}
            <PerformanceOverview listings={topListings} />

            {/* Attività recente */}
            <RecentActivity
                listings={recentListings}
                inquiries={recentInquiries}
                notifications={recentNotifications}
            />
        </div>
    )
}

// Helper functions per dati aggregati
async function getViewsLast30Days(userId: string) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const listings = await prisma.listing.findMany({
        where: { userId },
        select: { id: true, views: true, createdAt: true },
    })

    // Genera dati giornalieri (simulati - in produzione useresti un tracking reale)
    const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
            date: date.toISOString().split('T')[0],
            views: Math.floor(Math.random() * 100), // In produzione, aggrega da analytics table
        }
    })

    return days
}

async function getInquiriesLast30Days(userId: string) {
    const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        return prisma.inquiry.count({
            where: {
                receiverId: userId,
                createdAt: { gte: startOfDay, lte: endOfDay },
            },
        }).then(count => ({
            date: date.toISOString().split('T')[0],
            inquiries: count,
        }))
    })

    return Promise.all(days)
}