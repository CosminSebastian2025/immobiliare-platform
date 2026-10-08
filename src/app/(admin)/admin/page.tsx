import { prisma } from '@/lib/prisma'
import { AdminStats } from '@/components/admin/admin-stats'
import { RecentUsers } from '@/components/admin/recent-users'
import { PendingListings } from '@/components/admin/pending-listings'

export default async function AdminPage() {
    const [totalUsers, totalListings, totalSubscriptions, pendingListings] = await Promise.all([
        prisma.user.count(),
        prisma.listing.count(),
        prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        prisma.listing.count({ where: { status: 'PENDING' } }),
    ])

    const recentUsers = await prisma.user.findMany({
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
    })

    const pending = await prisma.listing.findMany({
        where: { status: 'PENDING' },
        include: { user: true, address: true },
        take: 10,
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

            <AdminStats
                totalUsers={totalUsers}
                totalListings={totalListings}
                totalSubscriptions={totalSubscriptions}
                pendingListings={pendingListings}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <RecentUsers users={recentUsers} />
                <PendingListings listings={pending} />
            </div>
        </div>
    )
}