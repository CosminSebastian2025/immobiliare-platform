// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	
	await prisma.$connect();
	
	// Categorie
	const categories = [
		{ name: 'Appartamenti', slug: 'appartamenti', icon: 'Building2' },
		{ name: 'Case', slug: 'case', icon: 'Home' },
		{ name: 'Ville', slug: 'ville', icon: 'Castle' },
		{ name: 'Camere', slug: 'camere', icon: 'Bed' },
		{ name: 'Monolocali', slug: 'monolocali', icon: 'Square' },
		{ name: 'Loft', slug: 'loft', icon: 'Warehouse' },
		{ name: 'Terreni', slug: 'terreni', icon: 'LandPlot' },
		{ name: 'Commerciali', slug: 'commerciali', icon: 'Store' },
		{ name: 'Garage', slug: 'garage', icon: 'Car' },
	]
	
	for (const category of categories) {
		await prisma.category.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		})
	}
	
	// Features
	const features = [
		{ name: 'Piscina', icon: 'Waves' },
		{ name: 'Camino', icon: 'Flame' },
		{ name: 'Portineria', icon: 'Shield' },
		{ name: 'Cantina', icon: 'Wine' },
		{ name: 'Solarium', icon: 'Sun' },
		{ name: 'Vista mare', icon: 'Waves' },
		{ name: 'Vista montagna', icon: 'Mountain' },
		{ name: 'Impianto fotovoltaico', icon: 'SolarPanel' },
		{ name: 'Domotica', icon: 'Cpu' },
		{ name: 'Allarme', icon: 'Bell' },
		{ name: 'Cancello elettrico', icon: 'Gate' },
		{ name: 'Fibra ottica', icon: 'Wifi' },
	]
	
	for (const feature of features) {
		await prisma.feature.upsert({
			where: { name: feature.name },
			update: {},
			create: feature,
		})
	}
	
	// Piani abbonamento
	const plans = [
		{
			name: 'Free',
			slug: 'free',
			type: 'FREE',
			description: 'Per privati che vogliono pubblicare pochi annunci',
			priceMonthly: 0,
			priceYearly: 0,
			maxListings: 3,
			maxPhotos: 5,
			featuredSlots: 0,
			features: ['3 annunci attivi', '5 foto per annuncio', 'Contatti base'],
			sortOrder: 1,
		},
		{
			name: 'Basic',
			slug: 'basic',
			type: 'BASIC',
			description: 'Per chi vuole più visibilità',
			priceMonthly: 1999, // 19.99€
			priceYearly: 19999, // 199.99€
			maxListings: 10,
			maxPhotos: 15,
			featuredSlots: 2,
			features: [
				'10 annunci attivi',
				'15 foto per annuncio',
				'2 annunci in evidenza/mese',
				'Statistiche base',
				'Supporto email',
			],
			sortOrder: 2,
		},
		{
			name: 'Pro',
			slug: 'pro',
			type: 'PRO',
			description: 'Per agenzie immobiliari',
			priceMonthly: 4999, // 49.99€
			priceYearly: 49999, // 499.99€
			maxListings: 50,
			maxPhotos: 30,
			featuredSlots: 10,
			features: [
				'50 annunci attivi',
				'30 foto per annuncio',
				'10 annunci in evidenza/mese',
				'Statistiche avanzate',
				'Badge agenzia verificata',
				'Supporto prioritario',
				'Export dati',
			],
			sortOrder: 3,
		},
		{
			name: 'Enterprise',
			slug: 'enterprise',
			type: 'ENTERPRISE',
			description: 'Per grandi agenzie e network',
			priceMonthly: 9999, // 99.99€
			priceYearly: 99999, // 999.99€
			maxListings: -1, // illimitati
			maxPhotos: 50,
			featuredSlots: 30,
			features: [
				'Annunci illimitati',
				'50 foto per annuncio',
				'30 annunci in evidenza/mese',
				'Statistiche complete',
				'Badge agenzia verificata',
				'Supporto dedicato',
				'API access',
				'Account manager dedicato',
			],
			sortOrder: 4,
		},
	]
	
	for (const plan of plans) {
		await prisma.plan.upsert({
			where: { slug: plan.slug },
			update: {},
			create: plan,
		})
	}
	
	// Admin user
	const adminPassword = await bcrypt.hash('admin123', 10)
	await prisma.user.upsert({
		where: { email: 'admin@immobiliare.it' },
		update: {},
		create: {
			email: 'admin@immobiliare.it',
			password: adminPassword,
			name: 'Admin',
			role: 'ADMIN',
			status: 'ACTIVE',
			emailVerified: new Date(),
			profile: {
				create: {
					fullName: 'Amministratore',
					verified: true,
					verifiedAt: new Date(),
				},
			},
		},
	})
	
	console.log('✅ Seed completed successfully!')
}

main()
		.catch((e) => {
			console.error('❌ Seed failed:', e)
			process.exit(1)
		})
		.finally(async () => {
			await prisma.$disconnect()
		})