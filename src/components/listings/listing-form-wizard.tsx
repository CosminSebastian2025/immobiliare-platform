'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { StepBasicInfo } from './steps/step-basic-info'
import { StepLocation } from './steps/step-location'
import { StepDetails } from './steps/step-details'
import { StepPhotos } from './steps/step-photos'
import { StepPricing } from './steps/step-pricing'
import { StepReview } from './steps/step-review'

const steps = [
    { id: 1, name: 'Info base', component: StepBasicInfo },
    { id: 2, name: 'Posizione', component: StepLocation },
    { id: 3, name: 'Dettagli', component: StepDetails },
    { id: 4, name: 'Foto', component: StepPhotos },
    { id: 5, name: 'Prezzo', component: StepPricing },
    { id: 6, name: 'Riepilogo', component: StepReview },
]

export interface ListingFormData {
    // Info base
    title: string
    description: string
    listingType: string
    propertyType: string

    // Posizione
    region: string
    province: string
    city: string
    neighborhood: string
    street: string
    zipCode: string
    latitude: number | null
    longitude: number | null

    // Dettagli
    rooms: number | null
    bedrooms: number | null
    bathrooms: number | null
    sqm: number | null
    floor: number | null
    yearBuilt: number | null
    energyClass: string

    // Dotazioni
    furnished: boolean
    elevator: boolean
    parking: boolean
    garden: boolean
    balcony: boolean
    terrace: boolean
    airConditioning: boolean
    heating: boolean
    petsAllowed: boolean

    // Disponibilità
    availableFrom: string
    availableTo: string

    // Foto
    photos: File[]
    coverPhotoIndex: number

    // Prezzo
    price: number
    pricePeriod: string

    // Extra
    features: string[]
}

const initialData: ListingFormData = {
    title: '',
    description: '',
    listingType: 'sale',
    propertyType: 'apartment',
    region: '',
    province: '',
    city: '',
    neighborhood: '',
    street: '',
    zipCode: '',
    latitude: null,
    longitude: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    sqm: null,
    floor: null,
    yearBuilt: null,
    energyClass: '',
    furnished: false,
    elevator: false,
    parking: false,
    garden: false,
    balcony: false,
    terrace: false,
    airConditioning: false,
    heating: false,
    petsAllowed: false,
    availableFrom: '',
    availableTo: '',
    photos: [],
    coverPhotoIndex: 0,
    price: 0,
    pricePeriod: '',
    features: [],
}

export function ListingFormWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<ListingFormData>(initialData)
    const [loading, setLoading] = useState(false)

    const updateFormData = (data: Partial<ListingFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }))
    }

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)

        try {
            // 1. Upload foto
            const photoUrls: string[] = []
            for (const photo of formData.photos) {
                const uploadRes = await uploadPhoto(photo)
                if (uploadRes) photoUrls.push(uploadRes)
            }

            // 2. Crea annuncio
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    photos: photoUrls,
                    coverPhotoIndex: formData.coverPhotoIndex,
                }),
            })

            if (!res.ok) throw new Error('Errore nella creazione')

            const data = await res.json()
            router.push(`/dashboard/listings?created=${data.listingId}`)
            router.refresh()
        } catch (error) {
            console.error('Errore:', error)
            alert('Si è verificato un errore. Riprova.')
            setLoading(false)
        }
    }

    const uploadPhoto = async (file: File): Promise<string | null> => {
        try {
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            })

            if (!res.ok) return null
            const data = await res.json()
            return data.url
        } catch {
            return null
        }
    }

    const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component

    return (
        <div>
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                                    currentStep > step.id
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 text-gray-400'
                                }`}
                            >
                                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-12 sm:w-20 h-0.5 mx-1 ${
                                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-gray-500">
                    Passaggio {currentStep} di {steps.length}: <strong>{steps[currentStep - 1].name}</strong>
                </p>
            </div>

            {/* Contenuto step */}
            <div className="bg-white rounded-xl border p-6 mb-6">
                {CurrentStepComponent && (
                    <CurrentStepComponent data={formData} onChange={updateFormData} />
                )}
            </div>

            {/* Navigazione */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2.5 rounded-lg border font-medium disabled:opacity-50 hover:bg-gray-50"
                >
                    Indietro
                </button>

                {currentStep < steps.length ? (
                    <button
                        onClick={nextStep}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                        Continua
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Pubblicazione...' : 'Pubblica annuncio'}
                    </button>
                )}
            </div>
        </div>
    )
}