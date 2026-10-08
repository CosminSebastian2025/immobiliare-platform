'use client'

import { useState } from 'react'
import { ListingFormData } from '../listing-form-wizard'
import { MapPin, Loader2 } from 'lucide-react'

interface Props {
    data: ListingFormData
    onChange: (data: Partial<ListingFormData>) => void
}

const regions = [
    'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
    'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
    'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
    'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto',
]

export function StepLocation({ data, onChange }: Props) {
    const [geocoding, setGeocoding] = useState(false)

    const handleGeocode = async () => {
        if (!data.city) return
        setGeocoding(true)

        try {
            const query = `${data.street || ''} ${data.city} ${data.province} Italia`.trim()
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            )
            const results = await res.json()

            if (results.length > 0) {
                onChange({
                    latitude: parseFloat(results[0].lat),
                    longitude: parseFloat(results[0].lon),
                })
            }
        } catch (error) {
            console.error('Geocoding error:', error)
        } finally {
            setGeocoding(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Regione *</label>
                    <select
                        value={data.region}
                        onChange={(e) => onChange({ region: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleziona regione</option>
                        {regions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Provincia *</label>
                    <input
                        type="text"
                        value={data.province}
                        onChange={(e) => onChange({ province: e.target.value.toUpperCase() })}
                        placeholder="MI"
                        maxLength={2}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Città *</label>
                    <input
                        type="text"
                        value={data.city}
                        onChange={(e) => onChange({ city: e.target.value })}
                        placeholder="Milano"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Quartiere</label>
                    <input
                        type="text"
                        value={data.neighborhood}
                        onChange={(e) => onChange({ neighborhood: e.target.value })}
                        placeholder="Brera"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Indirizzo</label>
                    <input
                        type="text"
                        value={data.street}
                        onChange={(e) => onChange({ street: e.target.value })}
                        placeholder="Via Roma 1 (opzionale)"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">CAP</label>
                    <input
                        type="text"
                        value={data.zipCode}
                        onChange={(e) => onChange({ zipCode: e.target.value })}
                        placeholder="20121"
                        maxLength={5}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Geocoding automatico */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                        <p className="text-sm font-medium">Posizione sulla mappa</p>
                        <p className="text-xs text-gray-500">
                            {data.latitude && data.longitude
                                ? '✓ Posizione impostata'
                                : 'Clicca per rilevare la posizione automaticamente'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleGeocode}
                    disabled={geocoding || !data.city}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Rileva posizione
                </button>
            </div>
        </div>
    )
}