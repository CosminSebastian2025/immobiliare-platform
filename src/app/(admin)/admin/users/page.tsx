import { prisma } from '@/lib/prisma'
import { UsersTable } from '@/components/admin/users-table'
import { UsersFilters } from '@/components/admin/users-filters'

interface Props {
    searchParams: {
        role?: string
        status?: string
        search?: string
        page?: string
    }
}

export default async function UsersPage({ searchParams }: Props) {
    const where: any = {}

    if (searchParams.role) where.role = searchParams.role
    if (searchParams.status) where.status = searchParams.status
    if (searchParams.search) {
        where.OR = [
            { email: { contains: searchParams.search, mode: 'insensitive' } },
            { name: { contains: searchParams.search, mode: 'insensitive' } },
            { profile: { agencyName: { contains: searchParams.search, mode: 'insensitive' } } },
        ]
    }

    const page = parseInt(searchParams.page || '1')
    const perPage = 20

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: {
                profile: true,
                _count: {
                    select: { listings: true, inquiriesReceived: true },
                },
                subscription: { include: { plan: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.user.count({ where }),
    ])

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Gestione Utenti</h1>
                <p className="text-gray-500 mt-1">Totale: {total} utenti registrati</p>
            </div>

            <UsersFilters currentFilters={searchParams} />
            <UsersTable users={users} total={total} page={page} perPage={perPage} />
        </div>
    )
}