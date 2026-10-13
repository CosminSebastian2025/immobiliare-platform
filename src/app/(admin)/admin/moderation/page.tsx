import { prisma } from '@/lib/prisma'
import { ModerationQueue } from '@/components/admin/moderation-queue'

export default async function ModerationPage() {
    const pendingListings = await prisma.listing.findMany({
        where: { status: 'PENDING' },
        include: {
            user: { include: { profile: true } },
            address: true,
            photos: { orderBy: { position: 'asc' }, take: 5 },
        },
        orderBy: { createdAt: 'asc' },
    })

    const reportedListings = await prisma.listing.findMany({
        where: { status: 'REPORTED' },
        include: {
            user: { include: { profile: true } },
            address: true,
            photos: { take: 3 },
        },
    })

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Moderazione</h1>
                <p className="text-gray-500 mt-1">
                    Revisiona gli annunci in attesa di approvazione
                </p>
            </div>

            <ModerationQueue
                pending={pendingListings}
                reported={reportedListings}
            />
        </div>
    )
}