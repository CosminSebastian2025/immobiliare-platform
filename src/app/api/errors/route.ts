import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const error = await req.json()

        // Log su console (in produzione, usare Sentry/LogRocket)
        console.error('Client error:', {
            timestamp: new Date().toISOString(),
            error: error.error,
            stack: error.stack,
            userAgent: req.headers.get('user-agent'),
            url: req.headers.get('referer'),
        })

        // In produzione, invia a servizio esterno:
        // await Sentry.captureException(error)

        return NextResponse.json({ logged: true })
    } catch {
        return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
    }
}