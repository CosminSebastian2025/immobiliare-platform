import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {authOptions} from '@/lib/auth'
import {exec} from 'child_process'
import {promisify} from 'util'

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({error: 'Unauthorized'}, {status: 403})
    }

    try {
        // Avvia backup in background
        exec('npm run db:backup', (error) => {
            if (error) console.error('Backup error:', error)
        })

        return NextResponse.json({
            message: 'Backup avviato in background',
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        return NextResponse.json({error: 'Backup fallito'}, {status: 500})
    }
}