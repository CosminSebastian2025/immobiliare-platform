// src/app/(public)/page.tsx

import { SearchBar } from '@/components/search/search-bar'
import ListingGrid from '@/components/listings/listing-grid'
import CategoryGrid from '@/components/listings/category-grid'

export default function HomePage() {
    return (
        <div>
            {/* Hero section */}
            <section className="bg-gradient-to-b from-blue-50 to-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trova la tua prossima casa
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Migliaia di annunci di case, appartamenti e camere in vendita e in affitto in tutta Italia.
                    </p>
                    <SearchBar />
                </div>
            </section>

            {/* Categorie */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Cosa stai cercando?</h2>
                    <CategoryGrid />
                </div>
            </section>

            {/* Annunci recenti */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Annunci recenti</h2>
                        <a href="/search" className="text-blue-600 hover:underline text-sm font-medium">
                            Vedi tutti →
                        </a>
                    </div>
                    <ListingGrid listing={{
                        id: "",
                        title: "",
                        slug: "",
                        price: 0,
                        pricePeriod: undefined,
                        rooms: undefined,
                        bathrooms: undefined,
                        sqm: undefined,
                        featured: false,
                        address: undefined,
                        photos: []
                    }} />
                </div>
            </section>

            {/* CTA per agenzie */}
            <section className="py-16 bg-blue-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Sei un agenzia immobiliare?
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                        Pubblica i tuoi annunci, raggiungi migliaia di clienti e gestisci tutto da un unico pannello.
                    </p>
                    <a
                        href="/pricing"
                        className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Scopri i piani
                    </a>
                </div>
            </section>
        </div>
    )
}