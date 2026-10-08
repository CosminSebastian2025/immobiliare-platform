import { Metadata } from 'next'
import { ListingFormWizard } from '@/components/listings/listing-form-wizard'

export const metadata: Metadata = {
    title: 'Pubblica annuncio',
}

export default function NewListingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">Pubblica il tuo annuncio</h1>
                <p className="text-gray-500 mb-8">
                    Completa tutti i passaggi per pubblicare il tuo immobile
                </p>
                <ListingFormWizard />
            </div>
        </div>
    )
}