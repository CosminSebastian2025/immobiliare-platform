import { formatPrice } from '@/lib/stripe'

interface Props {
    listing: any
}

export function ListingStructuredData({ listing }: Props) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: listing.title,
        description: listing.description,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listing.slug}`,
        image: listing.photos.map((p: any) => p.url),
        datePosted: listing.publishedAt || listing.createdAt,

        ...(listing.address && {
            address: {
                '@type': 'PostalAddress',
                addressCountry: 'IT',
                addressRegion: listing.address.region,
                addressLocality: listing.address.city,
                streetAddress: listing.address.street,
                postalCode: listing.address.zipCode,
            },
        }),

        ...(listing.latitude && listing.longitude && {
            geo: {
                '@type': 'GeoCoordinates',
                latitude: listing.latitude,
                longitude: listing.longitude,
            },
        }),

        offers: {
            '@type': 'Offer',
            price: listing.price / 100,
            priceCurrency: 'EUR',
            ...(listing.pricePeriod === 'rent' && {
                priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: listing.price / 100,
                    priceCurrency: 'EUR',
                    unitText: 'MONTH',
                },
            }),
            availability: listing.status === 'PUBLISHED'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },

        ...(listing.sqm && { floorSize: { '@type': 'QuantitativeValue', value: listing.sqm, unitCode: 'MTK' } }),
        ...(listing.rooms && { numberOfRooms: listing.rooms }),
        ...(listing.bathrooms && { numberOfBathroomsTotal: listing.bathrooms }),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}