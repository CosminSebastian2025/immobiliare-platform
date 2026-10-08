'use client'

import { useState } from 'react'
import { ListingCard } from '@/components/listings/listing-card'
import { MapView } from './map-view'
import { LayoutGrid, Map, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
    listings: any[]
    total: number
    page: number
    perPage: number
    view: 'list' | 'map'
}

export function SearchResults({ listings, total, page, perPage, view: initialView }: Props) {
    const [view, setView] = useState(initialView)
    const totalPages = Math.ceil(total / perPage)

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Pagina {page} di {totalPages}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`p-2 rounded-lg ${view === 'map' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        <Map className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Contenuto */}
            {view === 'list' ? (
                <>
                    {listings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nessun annuncio trovato</p>
                            <p className="text-sm text-gray-400 mt-1">Prova a modificare i filtri di ricerca</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {/* Paginazione */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {page > 1 && (
                                <a
                                    href={`?page=${page - 1}`}
                                    className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Prec
                                </a>
                            )}
                            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">{page}</span>
                            {page < totalPages && (
                                <a
                                    href={`?page=${page + 1}`}
                                    className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Succ <ChevronRight className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <MapView listings={listings} />
            )}
        </div>
    )
}