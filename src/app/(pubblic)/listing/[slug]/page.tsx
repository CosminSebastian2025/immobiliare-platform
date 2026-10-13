import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const listing = await prisma.listing.findUnique({
        where: { slug: params.slug },
        include: { address: true, photos: { take: 1 } },
    })

    if (!listing) {
        return { title: 'Annuncio non trovato' }
    }

    const price = listing.pricePeriod === 'month'
        ? `€${listing.price.toLocaleString('it-IT')}/mese`
        : listing.pricePeriod === 'night'
            ? `€${listing.price.toLocaleString('it-IT')}/notte`
            : `€${listing.price.toLocaleString('it-IT')}`

    const description = `${listing.title} - ${price} - ${listing.address?.city || ''}${listing.rooms ? ` - ${listing.rooms} locali` : ''}${listing.sqm ? ` - ${listing.sqm}m²` : ''}. ${listing.description.slice(0, 100)}...`

    return {
        title: `${listing.title} | ${listing.address?.city || 'Immobiliare'}`,
        description,
        openGraph: {
            title: listing.title,
            description,
            images: listing.photos[0]?.url ? [listing.photos[0].url] : [],
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listing.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: listing.title,
            description,
            images: listing.photos[0]?.url ? [listing.photos[0].url] : [],
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listing.slug}`,
        },
    }
}