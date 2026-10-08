'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'

interface Props {
    currentParams: Record<string, string | undefined>
}

export function SearchFilters({ currentParams }: Props) {
    const router = useRouter()
    const [filters, setFilters] = useState({
        listingType: currentParams.type || 'all',
        minPrice: currentParams.minPrice || '',
        maxPrice: currentParams.maxPrice || '',
        rooms: currentParams.rooms || '',
        propertyType: '',
        sqmMin: '',
        bathrooms: '',
    })

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (currentParams.location) params.set('location', currentParams.location)
        if (filters.listingType !== 'all') params.set('type', filters.listingType)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
        if (filters.rooms) params.set('rooms', filters.rooms)

        router.push(`/search?${params.toString()}`)
    }

    const resetFilters = () => {
        setFilters({
            listingType: 'all',
            minPrice: '',
            maxPrice: '',
            rooms: '',
            propertyType: '',
            sqmMin: '',
            bathrooms: '',
        })
        router.push('/search')
    }

    return (
        <div className="bg-white rounded-xl border p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtri
                </h2>
                <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                    <X className="h-4 w-4" />
                    Reset
                </button>
            </div>

            <div className="space-y-5">
                {/* Tipo annuncio */}
                <div>
                    <label className="block text-sm font-medium mb-2">Tipo annuncio</label>
                    <select
                        value={filters.listingType}
                        onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    >
                        <option value="all">Tutti</option>
                        <option value="sale">Vendita</option>
                        <option value="rent_long">Affitto lungo</option>
                        <option value="rent_short">Affitto breve</option>
                        <option value="room">Camere</option>
                    </select>
                </div>

                {/* Prezzo */}
                <div>
                    <label className="block text-sm font-medium mb-2">Prezzo (€)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                    </div>
                </div>

                {/* Stanze */}
                <div>
                    <label className="block text-sm font-medium mb-2">Locali (min)</label>
                    <div className="flex gap-2">
                        {['', '1', '2', '3', '4', '5'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilters({ ...filters, rooms: r })}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${
                                    filters.rooms === r
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {r || 'Tutti'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applica */}
                <button
                    onClick={applyFilters}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                    Applica filtri
                </button>
            </div>
        </div>
    )
}