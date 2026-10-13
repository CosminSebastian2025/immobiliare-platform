// src/components/listings/listing-card.tsx

import Link from 'next/link'
import {Bath, Bed, Heart, MapPin, Ruler} from 'lucide-react'
import {formatPrice} from '@/lib/stripe'
import {analytics} from '@/lib/analytics'

interface ListingCardProps {
    listing: {
        id: string
        title: string
        slug: string
        price: number
        pricePeriod?: string | null
        rooms?: number | null
        bathrooms?: number | null
        sqm?: number | null
        featured: boolean
        address?: {
            city: string
            neighborhood?: string | null
        } | null
        photos: {
            url: string
            isCover: boolean
        }[]
    }
}

export default function ListingCard({ listing }: ListingCardProps) {
    const coverPhoto = listing.photos.find(p => p.isCover) || listing.photos[0]

    const priceText = listing.pricePeriod === 'month'
        ? `${formatPrice(listing.price)}/mese`
        : listing.pricePeriod === 'night'
            ? `${formatPrice(listing.price)}/notte`
            : formatPrice(listing.price)

    const handleView = () => {
        analytics.listingViewed(listing.id, listing.title, listing.price)
    }

    return (
        <Link
            href={`/listing/${listing.slug}`}
            onClick={handleView}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Immagine */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {coverPhoto ? (
                    <img
                        src={coverPhoto.url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No foto</span>
                    </div>
                )}

                {/* Badge */}
                {listing.featured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                        In evidenza
                    </span>
                )}

                {/* Preferiti */}
                <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white">
                    <Heart className="h-4 w-4" />
                </button>
            </div>

            {/* Contenuto */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold line-clamp-1 group-hover:text-blue-600">
                        {listing.title}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="h-4 w-4" />
                    {listing.address?.city}
                    {listing.address?.neighborhood && ` · ${listing.address.neighborhood}`}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {listing.rooms && (
                        <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {listing.rooms}
            </span>
                    )}
                    {listing.bathrooms && (
                        <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {listing.bathrooms}
            </span>
                    )}
                    {listing.sqm && (
                        <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" /> {listing.sqm} m²
            </span>
                    )}
                </div>

                <p className="text-lg font-bold text-blue-600">{priceText}</p>
            </div>
        </Link>
    )
}