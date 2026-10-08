'use client'

import { ListingFormData } from '../listing-form-wizard'
import { formatPrice } from '@/lib/stripe'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

export function StepPricing({ data, onChange }: Props) {
    const isRent = data.listingType.startsWith('rent') || data.listingType === 'room'

    return (
        <div className="space-y-6">
            {/* Prezzo */}
            <div>
                <label className="block text-sm font-medium mb-1.5">
                    Prezzo {isRent ? '(al mese)' : 'di vendita'} (€) *
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min={0}
                        value={data.price || ''}
                        onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
                        placeholder={isRent ? '1200' : '250000'}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
                {data.price > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(data.price * 100)}
                        {isRent && ' al mese'}
                    </p>
                )}
            </div>

            {/* Periodo (solo per affitti) */}
            {isRent && (
                <div>
                    <label className="block text-sm font-medium mb-2">Periodo di prezzo</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => onChange({ pricePeriod: 'month' })}
                            className={`flex-1 p-3 rounded-lg border text-center font-medium transition-colors ${
                                data.pricePeriod === 'month'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            📅 Al mese
                        </button>
                        {data.listingType === 'rent_short' && (
                            <button
                                type="button"
                                onClick={() => onChange({ pricePeriod: 'night' })}
                                className={`flex-1 p-3 rounded-lg border text-center font-medium transition-colors ${
                                    data.pricePeriod === 'night'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                🌙 A notte
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Stima prezzo al m² */}
            {data.sqm && data.price > 0 && !isRent && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        Prezzo al m²: <strong>{Math.round(data.price / data.sqm)} €/m²</strong>
                    </p>
                </div>
            )}
        </div>
    )
}