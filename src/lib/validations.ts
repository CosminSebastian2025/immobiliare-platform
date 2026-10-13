import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(8, 'Password di almeno 8 caratteri'),
})

export const registerSchema = z.object({
    name: z.string().min(2, 'Nome di almeno 2 caratteri'),
    email: z.string().email('Email non valida'),
    password: z
        .string()
        .min(8, 'Almeno 8 caratteri')
        .regex(/[A-Z]/, 'Deve contenere una maiuscola')
        .regex(/[0-9]/, 'Deve contenere un numero'),
    confirmPassword: z.string(),
    role: z.enum(['PRIVATE', 'AGENCY']),
    phone: z.string().optional(),
    agencyName: z.string().optional(),
    vatNumber: z
        .string()
        .regex(/^\d{11}$/, 'Partita IVA non valida')
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non coincidono',
    path: ['confirmPassword'],
})

export const listingSchema = z.object({
    title: z.string().min(10, 'Titolo troppo corto').max(100, 'Max 100 caratteri'),
    description: z.string().min(50, 'Descrizione troppo corta').max(5000),
    listingType: z.enum(['SALE', 'RENT_LONG', 'RENT_SHORT', 'ROOM']),
    propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'ROOM', 'STUDIO', 'LOFT', 'LAND', 'COMMERCIAL', 'GARAGE']),
    price: z.number().positive('Prezzo deve essere positivo'),
    rooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().min(0).optional(),
    sqm: z.number().int().positive().optional(),
    region: z.string().min(1, 'Regione obbligatoria'),
    city: z.string().min(1, 'Città obbligatoria'),
})

export const inquirySchema = z.object({
    name: z.string().min(2, 'Nome di almeno 2 caratteri'),
    email: z.string().email('Email non valida'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Messaggio di almeno 10 caratteri').max(2000),
    visitDate: z.string().optional(),
})

// Helper per uso nei form
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ListingInput = z.infer<typeof listingSchema>
export type InquiryInput = z.infer<typeof inquirySchema>