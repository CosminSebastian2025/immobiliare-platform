import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tuosito.it'

    // Pagine statiche
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/chi-siamo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/contatti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    // Annunci
    const listings = await prisma.listing.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
    })

    const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
        url: `${baseUrl}/listing/${listing.slug}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // Agenzie
    const agencies = await prisma.user.findMany({
        where: { role: 'AGENCY', status: 'ACTIVE' },
        include: { profile: true },
        select: { id: true, updatedAt: true, profile: true },
    })

    const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => ({
        url: `${baseUrl}/agency/${agency.id}`,
        lastModified: agency.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
    }))

    return [...staticPages, ...listingPages, ...agencyPages]
}