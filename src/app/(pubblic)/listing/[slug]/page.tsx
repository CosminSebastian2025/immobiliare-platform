import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PhotoGallery } from '@/components/listings/photo-gallery'
import { ListingInfo } from '@/components/listings/listing-info'
import { ContactForm } from '@/components/listings/contact-form'
import { MapPin, Bed, Bath, Ruler, Calendar, Heart, Share2 } from 'lucide-react'
import { formatPrice } from '@/lib/stripe'

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const listing = await prisma.listing.findUnique({
        where: { slug: params.slug },
        include: { address: true },
    })

    if (!listing) return { title: 'Annuncio non trovato' }

    return {
        title: listing.title,
        description: listing.description.slice(0, 160),
    }
}

export default async function ListingPage({ params }: Props) {
    const listing = await prisma.listing.findUnique({
        where: { slug: params.slug },
        include: {
            user: {
                include: { profile: true },
            },
            address: true,
            photos: { orderBy: { position: 'asc' } },
            features: { include: { feature: true } },
        },
    })

    if (!listing || listing.status !== 'PUBLISHED') {
        notFound()
    }

    // Incrementa views
    await prisma.listing.update({
        where: { id: listing.id },
        data: { views: { increment: 1 } },
    })

    const priceText = listing.pricePeriod === 'month'
        ? `${formatPrice(listing.price)}/mese`
        : listing.pricePeriod === 'night'
            ? `${formatPrice(listing.price)}/notte`
            : formatPrice(listing.price)

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <a href="/" className="hover:text-blue-600">Home</a>
                <span className="mx-2">/</span>
                <a href="/search" className="hover:text-blue-600">Ricerca</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{listing.title}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
                {listing.address?.city}, {listing.address?.neighborhood}
            </span>
                        <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Pubblicato {new Date(listing.createdAt).toLocaleDateString('it-IT')}
            </span>
                        <span>{listing.views} visualizzazioni</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Heart className="h-5 w-5" />
                        Salva
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Share2 className="h-5 w-5" />
                        Condividi
                    </button>
                </div>
            </div>

            {/* Galleria foto */}
            <PhotoGallery photos={listing.photos} title={listing.title} />

            {/* Contenuto principale */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Colonna principale */}
                <div className="lg:col-span-2">
                    {/* Prezzo e caratteristiche */}
                    <div className="bg-white rounded-xl border p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-3xl font-bold text-blue-600">{priceText}</p>
                            {listing.energyClass && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Classe {listing.energyClass}
                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {listing.rooms && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Bed className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                    <p className="font-semibold">{listing.rooms}</p>
                                    <p className="text-xs text-gray-500">Locali</p>
                                </div>
                            )}
                            {listing.bathrooms && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Bath className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                    <p className="font-semibold">{listing.bathrooms}</p>
                                    <p className="text-xs text-gray-500">Bagni</p>
                                </div>
                            )}
                            {listing.sqm && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Ruler className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                    <p className="font-semibold">{listing.sqm} m²</p>
                                    <p className="text-xs text-gray-500">Superficie</p>
                                </div>
                            )}
                            {listing.floor && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                                    <p className="font-semibold">Piano {listing.floor}</p>
                                    <p className="text-xs text-gray-500">Piano</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrizione */}
                    <div className="bg-white rounded-xl border p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Descrizione</h2>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {listing.description}
                        </p>
                    </div>

                    {/* Caratteristiche */}
                    <div className="bg-white rounded-xl border p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Caratteristiche</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {listing.furnished && <FeatureBadge label="Arredato" />}
                            {listing.elevator && <FeatureBadge label="Ascensore" />}
                            {listing.parking && <FeatureBadge label="Posto auto" />}
                            {listing.garden && <FeatureBadge label="Giardino" />}
                            {listing.balcony && <FeatureBadge label="Balcone" />}
                            {listing.terrace && <FeatureBadge label="Terrazzo" />}
                            {listing.airConditioning && <FeatureBadge label="Aria condizionata" />}
                            {listing.heating && <FeatureBadge label="Riscaldamento" />}
                            {listing.petsAllowed && <FeatureBadge label="Animali ammessi" />}
                            {listing.features.map((lf) => (
                                <FeatureBadge key={lf.feature.id} label={lf.feature.name} />
                            ))}
                        </div>
                    </div>

                    {/* Mappa */}
                    {listing.latitude && listing.longitude && (
                        <div className="bg-white rounded-xl border p-6">
                            <h2 className="text-xl font-semibold mb-4">Posizione</h2>
                            <p className="text-gray-500 mb-4">
                                {listing.address?.city}, {listing.address?.neighborhood}
                            </p>
                            {/* Qui va la mappa Leaflet */}
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Mappa</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* Card agenzia/privato */}
                    <div className="bg-white rounded-xl border p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            {listing.user.image ? (
                                <img
                                    src={listing.user.image}
                                    alt={listing.user.name || ''}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {listing.user.name?.[0] || 'U'}
                  </span>
                                </div>
                            )}
                            <div>
                                <p className="font-semibold">
                                    {listing.user.role === 'AGENCY'
                                        ? listing.user.profile?.agencyName
                                        : listing.user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {listing.user.role === 'AGENCY' ? 'Agenzia immobiliare' : 'Privato'}
                                </p>
                            </div>
                        </div>

                        <ContactForm listingId={listing.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureBadge({ label }: { label: string }) {
    return (
        <span className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
      ✓ {label}
    </span>
    )
}