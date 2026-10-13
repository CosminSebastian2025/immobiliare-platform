import {mainDb, neonDb} from '../databases'

export class RealtimeSync {
    private static instance: RealtimeSync

    static getInstance() {
        if (!RealtimeSync.instance) {
            RealtimeSync.instance = new RealtimeSync()
        }
        return RealtimeSync.instance
    }

    // Sync quando viene creato un utente
    async onUserCreated(userId: string) {
        const user = await mainDb.user.findUnique({where: {id: userId}})
        if (!user) return

        await neonDb.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        }).catch(err => console.error('Neon sync error:', err))
    }

    // Sync quando viene aggiornato un utente
    async onUserUpdated(userId: string) {
        const user = await mainDb.user.findUnique({where: {id: userId}})
        if (!user) return

        await neonDb.user.update({
            where: {id: userId},
            data: {
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                updatedAt: new Date(),
            },
        }).catch(err => console.error('Neon sync error:', err))
    }

    // Sync quando viene creato un annuncio
    async onListingCreated(listingId: string) {
        const listing = await mainDb.listing.findUnique({
            where: {id: listingId},
            include: {address: true},
        })
        if (!listing) return

        try {
            await neonDb.listing.create({
                data: {
                    id: listing.id,
                    title: listing.title,
                    slug: listing.slug,
                    description: listing.description,
                    status: listing.status,
                    price: listing.price,
                    userId: listing.userId,
                    createdAt: listing.createdAt,
                    updatedAt: listing.updatedAt,
                    listingType: listing.listingType,
                    propertyType: listing.propertyType,
                },
            })
        } catch (err) {
            console.error('Neon listing sync error:', err)
        }
    }
}

export const realtimeSync = RealtimeSync.getInstance()