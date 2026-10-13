import {mainDb, mysqlDb, neonDb, sqliteDb} from '../src/lib/databases'

interface SyncOptions {
    tables?: string[]
    batchSize?: number
    lastSync?: Date
}

class DatabaseSync {
    private batchSize: number

    constructor(options: SyncOptions = {}) {
        this.batchSize = options.batchSize || 100
    }

    async syncUsers() {
        console.log('🔄 Sync utenti...')

        // Leggi da DB principale
        const users = await mainDb.user.findMany({
            include: {profile: true},
        })

        // Sync su Neon
        for (const user of users) {
            await neonDb.user.upsert({
                where: {id: user.id},
                update: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    updatedAt: new Date(),
                },
                create: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            })
        }

        // Sync su MySQL
        for (const user of users) {
            await mysqlDb.user.upsert({
                where: {id: user.id},
                update: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                },
                create: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            })
        }

        // Sync su SQLite
        for (const user of users) {
            await sqliteDb.user.upsert({
                where: {id: user.id},
                update: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                },
                create: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            })
        }

        console.log(`✅ ${users.length} utenti sincronizzati`)
    }

    async syncListings() {
        console.log('🔄 Sync annunci...')

        const listings = await mainDb.listing.findMany({
            include: {
                address: true,
                photos: true,
            },
        })

        // Logica di sync per listings
        for (const listing of listings) {
            await neonDb.listing.upsert({
                where: {id: listing.id},
                update: {
                    title: listing.title,
                    description: listing.description,
                    status: listing.status,
                    price: listing.price,
                    updatedAt: new Date(),
                },
                create: {
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
        }

        console.log(`✅ ${listings.length} annunci sincronizzati`)
    }

    async syncAll() {
        console.log('🚀 Avvio sincronizzazione completa...')
        const startTime = Date.now()

        try {
            await this.syncUsers()
            await this.syncListings()
            // Aggiungi altre tabelle

            const duration = ((Date.now() - startTime) / 1000).toFixed(2)
            console.log(`✅ Sincronizzazione completata in ${duration}s`)
        } catch (error) {
            console.error('❌ Errore sincronizzazione:', error)
            throw error
        }
    }

    async incrementalSync(lastSync: Date) {
        console.log('🔄 Sync incrementale...')

        const users = await mainDb.user.findMany({
            where: {updatedAt: {gt: lastSync}},
        })

        console.log(`📦 ${users.length} record da sincronizzare`)
        // ... sync solo record modificati
    }
}

// Esegui sync
const sync = new DatabaseSync()
sync.syncAll()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })