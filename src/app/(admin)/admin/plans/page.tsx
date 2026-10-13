import { prisma } from '@/lib/prisma'
import { PlansTable } from '@/components/admin/plans-table'
import { CreatePlanButton } from '@/components/admin/create-plan-button'

export default async function PlansPage() {
    const plans = await prisma.plan.findMany({
        include: {
            _count: { select: { subscriptions: true } },
        },
        orderBy: { sortOrder: 'asc' },
    })

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gestione Piani</h1>
                    <p className="text-gray-500 mt-1">Configura i piani di abbonamento</p>
                </div>
                <CreatePlanButton />
            </div>

            <PlansTable plans={plans} />
        </div>
    )
}