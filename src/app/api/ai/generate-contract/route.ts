import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {authOptions} from '@/lib/auth'
import {generateRentalContract} from '@/lib/ai/documents'
import {z} from 'zod'
import prisma from "@/lib/prisma";

const schema = z.object({
    landlordName: z.string(),
    landlordCF: z.string(),
    tenantName: z.string(),
    tenantCF: z.string(),
    propertyAddress: z.string(),
    propertyCity: z.string(),
    rentAmount: z.number(),
    startDate: z.string(),
    duration: z.number(),
    contractType: z.enum(['4+4', '3+2', 'transitorio', 'studenti']),
})

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    try {
        const data = schema.parse(await req.json())

        const contract = await generateRentalContract(data)

        // Log audit
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ai.contract.generated',
                entity: 'contract',
                metadata: {contractType: data.contractType},
            },
        })

        return NextResponse.json({contract})
    } catch (error) {
        console.error('Contract generation error:', error)
        return NextResponse.json(
            {error: 'Errore generazione contratto'},
            {status: 500}
        )
    }
}