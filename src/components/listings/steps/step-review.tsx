'use client'

import { ListingFormData } from '../listing-form-wizard'
import { MapPin, Bed, Bath, Ruler, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/stripe'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

export function StepReview({ data }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Riepilogo annuncio</h3>

            {/* Info principali */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-500">Titolo</span>
                    <span className="font-medium">{data.title}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Tipo annuncio</span>
                    <span className="font-medium capitalize">{data.listingType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Tipo immobile</span>
                    <span className="font-medium capitalize">{data.propertyType}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Posizione</span>
                    <span className="font-medium flex items-center gap-1">
            <MapPin className="h-4 w-4" />
                        {data.city}, {data.province}
          </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Prezzo</span>
                    <span className="font-medium text-blue-600 text-lg">
            {formatPrice(data.price * 100)}
                        {data.pricePeriod === 'month' && '/mese'}
                        {data.pricePeriod === 'night' && '/notte'}
          </span>
                </div>
            </div>

            {/* Caratteristiche */}
            <div className="grid grid-cols-3 gap-4 text-center">
                {data.rooms && (
                    <div className="bg-white border rounded-lg p-3">
                        <Bed className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                        <p className="font-semibold">{data.rooms}</p>
                        <p className="text-xs text-gray-500">Locali</p>
                    </div>
                )}
                {data.bathrooms && (
                    <div className="bg-white border rounded-lg p-3">
                        <Bath className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                        <p className="font-semibold">{data.bathrooms}</p>
                        <p className="text-xs text-gray-500">Bagni</p>
                    </div>
                )}
                {data.sqm && (
                    <div className="bg-white border rounded-lg p-3">
                        <Ruler className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                        <p className="font-semibold">{data.sqm} m²</p>
                        <p className="text-xs text-gray-500">Superficie</p>
                    </div>
                )}
            </div>

            {/* Foto */}
            <div>
                <p className="text-sm font-medium mb-2">{data.photos.length} foto</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {data.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(photo)}
                            alt={`Foto ${index + 1}`}
                            className={`w-20 h-16 object-cover rounded ${
                                data.coverPhotoIndex === index ? 'ring-2 ring-blue-600' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Nota */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    ⚠️ Verifica che tutte le informazioni siano corrette prima di pubblicare.
                    Potrai modificare l'annuncio anche dopo la pubblicazione.
                </p>
            </div>
        </div>
    )
}