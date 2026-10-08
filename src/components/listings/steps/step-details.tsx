'use client'

import { ListingFormData } from '../listing-form-wizard'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

const energyClasses = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G']

const amenities = [
    { key: 'furnished', label: 'Arredato' },
    { key: 'elevator', label: 'Ascensore' },
    { key: 'parking', label: 'Posto auto' },
    { key: 'garden', label: 'Giardino' },
    { key: 'balcony', label: 'Balcone' },
    { key: 'terrace', label: 'Terrazzo' },
    { key: 'airConditioning', label: 'Aria condizionata' },
    { key: 'heating', label: 'Riscaldamento' },
    { key: 'petsAllowed', label: 'Animali ammessi' },
] as const

export function StepDetails({ data, onChange }: Props) {
    return (
        <div className="space-y-6">
            {/* Caratteristiche principali */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Locali</label>
                    <input
                        type="number"
                        min={1}
                        value={data.rooms || ''}
                        onChange={(e) => onChange({ rooms: parseInt(e.target.value) || null })}
                        placeholder="3"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Camere da letto</label>
                    <input
                        type="number"
                        min={0}
                        value={data.bedrooms || ''}
                        onChange={(e) => onChange({ bedrooms: parseInt(e.target.value) || null })}
                        placeholder="2"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Bagni</label>
                    <input
                        type="number"
                        min={0}
                        value={data.bathrooms || ''}
                        onChange={(e) => onChange({ bathrooms: parseInt(e.target.value) || null })}
                        placeholder="1"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Superficie (m²)</label>
                    <input
                        type="number"
                        min={1}
                        value={data.sqm || ''}
                        onChange={(e) => onChange({ sqm: parseInt(e.target.value) || null })}
                        placeholder="85"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Piano</label>
                    <input
                        type="number"
                        value={data.floor || ''}
                        onChange={(e) => onChange({ floor: parseInt(e.target.value) || null })}
                        placeholder="3"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Anno costruzione</label>
                    <input
                        type="number"
                        min={1800}
                        max={new Date().getFullYear()}
                        value={data.yearBuilt || ''}
                        onChange={(e) => onChange({ yearBuilt: parseInt(e.target.value) || null })}
                        placeholder="2010"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Classe energetica */}
            <div>
                <label className="block text-sm font-medium mb-2">Classe energetica</label>
                <div className="flex flex-wrap gap-2">
                    {energyClasses.map((ec) => (
                        <button
                            key={ec}
                            type="button"
                            onClick={() => onChange({ energyClass: ec })}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                data.energyClass === ec
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {ec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dotazioni */}
            <div>
                <label className="block text-sm font-medium mb-2">Dotazioni e servizi</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((amenity) => (
                        <label
                            key={amenity.key}
                            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={data[amenity.key]}
                                onChange={(e) => onChange({ [amenity.key]: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{amenity.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Disponibilità */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Disponibile dal</label>
                    <input
                        type="date"
                        value={data.availableFrom}
                        onChange={(e) => onChange({ availableFrom: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {(data.listingType === 'rent_short') && (
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Disponibile fino al</label>
                        <input
                            type="date"
                            value={data.availableTo}
                            onChange={(e) => onChange({ availableTo: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}