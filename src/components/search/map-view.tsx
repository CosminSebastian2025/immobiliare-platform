'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { formatPrice } from '@/lib/stripe'

// Fix per icone Leaflet in Next.js
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
})

L.Marker.prototype.options.icon = DefaultIcon

interface Props {
    listings: any[]
}

export function MapView({ listings }: Props) {
    const listingsWithCoords = listings.filter(
        (l) => l.latitude && l.longitude
    )

    const center: [number, number] = listingsWithCoords.length > 0
        ? [listingsWithCoords[0].latitude, listingsWithCoords[0].longitude]
        : [41.9028, 12.4964] // Roma

    return (
        <div className="rounded-xl overflow-hidden border" style={{ height: '600px' }}>
            <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {listingsWithCoords.map((listing) => (
                    <Marker
                        key={listing.id}
                        position={[listing.latitude, listing.longitude]}
                    >
                        <Popup>
                            <div className="w-48">
                                <img
                                    src={listing.photos[0]?.url || '/placeholder.jpg'}
                                    alt={listing.title}
                                    className="w-full h-24 object-cover rounded mb-2"
                                />
                                <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                                <p className="text-blue-600 font-bold">
                                    {formatPrice(listing.price)}
                                    {listing.pricePeriod === 'month' && '/mese'}
                                </p>
                                <Link
                                    href={`/listing/${listing.slug}`}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Vedi annuncio →
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}