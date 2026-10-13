'use client'

import { useState } from 'react'
import { Check, X, Eye, AlertTriangle, MessageSquare } from 'lucide-react'
import { ListingReviewModal } from './listing-review-modal'

interface Props {
    pending: any[]
    reported: any[]
}

export function ModerationQueue({ pending, reported }: Props) {
    const [selectedListing, setSelectedListing] = useState<any>(null)

    const handleAction = async (listingId: string, action: 'approve' | 'reject' | 'report') => {
        const reason = action === 'reject' || action === 'report'
            ? prompt('Motivo del rifiuto/segnalazione:')
            : null

        if ((action === 'reject' || action === 'report') && !reason) return

        const res = await fetch(`/api/admin/listings/${listingId}/moderate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, reason }),
        })

        if (res.ok) {
            window.location.reload()
        } else {
            alert('Errore durante l\'operazione')
        }
    }

    return (
        <div className="space-y-6">
            {/* Annunci in attesa */}
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Annunci in attesa ({pending.length})
                </h2>

                {pending.length === 0 ? (
                    <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                        Nessun annuncio in attesa di moderazione
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pending.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl border overflow-hidden">
                                <div className="aspect-video overflow-hidden">
                                    {listing.photos[0]?.url ? (
                                        <img
                                            src={listing.photos[0].url}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100" />
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {listing.address?.city} · {listing.user.name || listing.user.email}
                                    </p>
                                    <p className="text-sm text-blue-600 font-medium mt-2">
                                        € {listing.price.toLocaleString('it-IT')}
                                    </p>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => setSelectedListing(listing)}
                                            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" /> Rivedi
                                        </button>
                                        <button
                                            onClick={() => handleAction(listing.id, 'reject')}
                                            className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(listing.id, 'approve')}
                                            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Annunci segnalati */}
            {reported.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        Annunci segnalati ({reported.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reported.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl border overflow-hidden border-amber-200">
                                <div className="aspect-video overflow-hidden">
                                    {listing.photos[0]?.url && (
                                        <img
                                            src={listing.photos[0].url}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{listing.address?.city}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                                            Mantieni
                                        </button>
                                        <button
                                            onClick={() => handleAction(listing.id, 'report')}
                                            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Rimuovi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedListing && (
                <ListingReviewModal
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                    onApprove={() => {
                        handleAction(selectedListing.id, 'approve')
                        setSelectedListing(null)
                    }}
                    onReject={() => {
                        handleAction(selectedListing.id, 'reject')
                        setSelectedListing(null)
                    }}
                />
            )}
        </div>
    )
}