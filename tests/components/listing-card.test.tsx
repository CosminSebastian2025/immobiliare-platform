import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ListingCard } from '@/components/listings/listing-card'

// Mock Next.js Link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock formatPrice
vi.mock('@/lib/stripe', () => ({
    formatPrice: (price: number) => `€${(price / 100).toLocaleString('it-IT')}`,
}))

describe('ListingCard', () => {
    const mockListing = {
        id: '1',
        title: 'Trilocale luminoso in zona Brera',
        slug: 'trilocale-brera',
        price: 250000,
        pricePeriod: null,
        rooms: 3,
        bathrooms: 2,
        sqm: 85,
        featured: false,
        address: {
            city: 'Milano',
            neighborhood: 'Brera',
        },
        photos: [
            { url: '/test.jpg', isCover: true },
        ],
    }

    it('renderizza il titolo', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText(mockListing.title)).toBeInTheDocument()
    })

    it('renderizza la città', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('Milano')).toBeInTheDocument()
    })

    it('renderizza il quartiere', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText(/Brera/)).toBeInTheDocument()
    })

    it('renderizza il prezzo correttamente', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('€2.500')).toBeInTheDocument()
    })

    it('renderizza il prezzo con periodo', () => {
        render(<ListingCard listing={{ ...mockListing, pricePeriod: 'month' }} />)
        expect(screen.getByText('€2.500/mese')).toBeInTheDocument()
    })

    it('renderizza le caratteristiche', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('3')).toBeInTheDocument() // rooms
        expect(screen.getByText('2')).toBeInTheDocument() // bathrooms
        expect(screen.getByText('85 m²')).toBeInTheDocument()
    })

    it('mostra il badge "In evidenza" se featured', () => {
        render(<ListingCard listing={{ ...mockListing, featured: true }} />)
        expect(screen.getByText('In evidenza')).toBeInTheDocument()
    })

    it('non mostra il badge se non featured', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.queryByText('In evidenza')).not.toBeInTheDocument()
    })

    it('ha un link corretto al dettaglio', () => {
        render(<ListingCard listing={mockListing} />)
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/listing/trilocale-brera')
    })

    it('gestisce listing senza foto', () => {
        render(<ListingCard listing={{ ...mockListing, photos: [] }} />)
        expect(screen.getByText('No foto')).toBeInTheDocument()
    })
})