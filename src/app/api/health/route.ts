import {NextResponse} from 'next/server'
import {mainDb} from '@/lib/databases'

export const dynamic = 'force-dynamic'

export async function GET() {
    const checks = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
    }

    // Check database
    try {
        await mainDb.$queryRaw`SELECT 1`
        checks.database = 'ok'
    } catch {
        checks.database = 'error'
    }

    // Check Neon
    try {
        const {neonDb} = await import('@/lib/databases')
        await neonDb.$queryRaw`SELECT 1`
        checks.neonDatabase = 'ok'
    } catch {
        checks.neonDatabase = 'error'
    }

    // Check external services
    try {
        await fetch('https://api.stripe.com/v1/charges', {
            method: 'GET',
            headers: {'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`},
        })
        checks.stripe = 'ok'
    } catch {
        checks.stripe = 'error'
    }

    const allOk = Object.values(checks).every(
        v => v === 'ok' || typeof v === 'number' || typeof v === 'string'
    )

    return NextResponse.json(checks, {
        status: allOk ? 200 : 500
    })
}