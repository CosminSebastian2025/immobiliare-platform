import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2026-09-30.endive',
	typescript: true,
})

export const formatPrice = ( price: number) : string => {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR',
	}).format(price / 100)
}

export const getStripePrice = (price: number, period?: string) : string=> {
	const formatted = formatPrice(price)
	if (period === 'month') return `${formatted}/mese`
	if (period === 'night') return `${formatted}/notte`
	return formatted
}