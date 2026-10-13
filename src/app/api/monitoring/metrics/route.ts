import {NextResponse} from 'next/server'
import {mainDb} from '@/lib/databases'

export async function GET() {
    const metrics = {
        // System
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),

        // Database
        dbConnections: await getDbConnections(),

        // Business metrics
        totalUsers: await mainDb.user.count(),
        activeListings: await mainDb.listing.count({where: {status: 'PUBLISHED'}}),
        activeSubscriptions: await mainDb.subscription.count({where: {status: 'ACTIVE'}}),
        pendingModeration: await mainDb.listing.count({where: {status: 'PENDING'}}),
        unreadMessages: await mainDb.message.count({where: {read: false}}),

        // Timestamps
        timestamp: new Date().toISOString(),
    }

    return NextResponse.json(metrics)
}

async function getDbConnections() {
    try {
        // Ottieni connessioni attive PostgreSQL
        const result: any = await mainDb.$queryRaw`
            SELECT count(*) as active_connections
            FROM pg_stat_activity
            WHERE state = 'active'
        `
        return result[0]?.active_connections || 0
    } catch {
        return 0
    }
}