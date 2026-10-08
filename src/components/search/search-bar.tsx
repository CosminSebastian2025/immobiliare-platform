// src/components/search/search-bar.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

export function SearchBar() {
    const router = useRouter()
    const [location, setLocation] = useState('')
    const [listingType, setListingType] = useState('all')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (location) params.set('location', location)
        if (listingType !== 'all') params.set('type', listingType)
        router.push(`/search?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl shadow-lg p-2">
                {/* Località */}
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Città, zona o quartiere..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Tipo */}
                <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tutti</option>
                    <option value="sale">Vendita</option>
                    <option value="rent_short">Affitto breve</option>
                    <option value="rent_long">Affitto lungo</option>
                    <option value="room">Camere</option>
                </select>

                {/* Submit */}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                    <Search className="h-5 w-5" />
                    Cerca
                </button>
            </div>
        </form>
    )
}