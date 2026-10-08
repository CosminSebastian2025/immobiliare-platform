import { Metadata } from 'next'
import { SearchResults } from '@/components/search/search-results'
import { SearchFilters } from '@/components/search/search-filters'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
    title: 'Cerca immobili',
}

interface SearchPageProps {
    searchParams: {
        location?: string
        type?: string
        minPrice?: string
        maxPrice?: string
        rooms?: string
        page?: string
        view?: 'list' | 'map'
    }
}

async function getListings(params: SearchPageProps['searchParams']) {
    const where: any = {
        status: 'PUBLISHED',
    }

    // Filtro località
    if (params.location) {
        where.address = {
            OR: [
                { city: { contains: params.location, mode: 'insensitive' } },
                { neighborhood: { contains: params.location, mode: 'insensitive' } },
                { region: { contains: params.location, mode: 'insensitive' } },
            ],
        }
    }

    // Filtro tipo
    if (params.type && params.type !== 'all') {
        where.listingType = params.type
    }

    // Filtro prezzo
    if (params.minPrice || params.maxPrice) {
        where.price = {}
        if (params.minPrice) where.price.gte = parseInt(params.minPrice) * 100
        if (params.maxPrice) where.price.lte = parseInt(params.maxPrice) * 100
    }

    // Filtro stanze
    if (params.rooms) {
        where.rooms = { gte: parseInt(params.rooms) }
    }

    const page = parseInt(params.page || '1')
    const perPage = 12

    const [listings, total] = await Promise.all([
        prisma.listing.findMany({
            where,
            include: {
                address: true,
                photos: { where: { isCover: true }, take: 1 },
            },
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.listing.count({ where }),
    ])

    return { listings, total, page, perPage }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { listings, total, page, perPage } = await getListings(searchParams)

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    {total} annunci {searchParams.location ? `a "${searchParams.location}"` : 'disponibili'}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar filtri */}
                <div className="lg:col-span-1">
                    <SearchFilters currentParams={searchParams} />
                </div>

                {/* Risultati */}
                <div className="lg:col-span-3">
                    <SearchResults
                        listings={listings}
                        total={total}
                        page={page}
                        perPage={perPage}
                        view={searchParams.view || 'list'}
                    />
                </div>
            </div>
        </div>
    )
}