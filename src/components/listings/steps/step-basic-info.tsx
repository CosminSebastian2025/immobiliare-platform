'use client'

import { ListingFormData } from '../listing-form-wizard'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

const listingTypes = [
    { value: 'sale', label: 'Vendita', icon: '🏷️' },
    { value: 'rent_long', label: 'Affitto lungo', icon: '📅' },
    { value: 'rent_short', label: 'Affitto breve', icon: '⏱️' },
    { value: 'room', label: 'Camera', icon: '🛏️' },
]

const propertyTypes = [
    { value: 'apartment', label: 'Appartamento' },
    { value: 'house', label: 'Casa indipendente' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Monolocale' },
    { value: 'loft', label: 'Loft' },
    { value: 'room', label: 'Camera singola' },
    { value: 'land', label: 'Terreno' },
    { value: 'commercial', label: 'Locale commerciale' },
    { value: 'garage', label: 'Garage/Box' },
]

export function StepBasicInfo({ data, onChange }: Props) {
    return (
        <div className="space-y-6">
            {/* Tipo annuncio */}
            <div>
                <label className="block text-sm font-medium mb-2">Tipo di annuncio</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {listingTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => onChange({ listingType: type.value })}
                            className={`p-4 rounded-lg border text-center transition-colors ${
                                data.listingType === type.value
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <span className="text-2xl block mb-1">{type.icon}</span>
                            <span className="text-sm font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tipo immobile */}
            <div>
                <label className="block text-sm font-medium mb-2">Tipo di immobile</label>
                <select
                    value={data.propertyType}
                    onChange={(e) => onChange({ propertyType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Titolo */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Titolo annuncio</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="Es. Trilocale luminoso in zona Brera"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">{data.title.length}/100 caratteri</p>
            </div>

            {/* Descrizione */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Descrizione</label>
                <textarea
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Descrivi l'immobile in dettaglio: caratteristiche, zona, servizi vicini..."
                    rows={6}
                    maxLength={5000}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{data.description.length}/5000 caratteri</p>
            </div>
        </div>
    )
}