import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {authOptions} from '@/lib/auth'
import {generateListingDescription} from '@/lib/ai/documents'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const data = await req.json()

    try {
        const enhanced = await generateListingDescription(data)
        return NextResponse.json(enhanced)
    } catch (error) {
        return NextResponse.json({error: 'Errore AI'}, {status: 500})
    }
}