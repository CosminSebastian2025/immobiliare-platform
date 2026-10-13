declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}

export const analytics = {
    // Eventi utente
    trackEvent(eventName: string, params?: Record<string, any>) {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, params)
        }
    },

    // Eventi business
    listingViewed(listingId: string, listingTitle: string, price: number) {
        this.trackEvent('view_item', {
            item_id: listingId,
            item_name: listingTitle,
            price,
            currency: 'EUR',
        })
    },

    listingCreated(listingId: string, listingType: string) {
        this.trackEvent('listing_created', {
            item_id: listingId,
            listing_type: listingType,
        })
    },

    inquirySent(listingId: string, senderType: 'private' | 'agency') {
        this.trackEvent('generate_lead', {
            item_id: listingId,
            sender_type: senderType,
        })
    },

    subscriptionStarted(planName: string, value: number) {
        this.trackEvent('begin_checkout', {
            currency: 'EUR',
            value,
            items: [{item_name: planName}],
        })
    },

    subscriptionCompleted(planName: string, value: number) {
        this.trackEvent('purchase', {
            currency: 'EUR',
            value,
            items: [{item_name: planName, price: value}],
            transaction_id: `sub_${Date.now()}`,
        })
    },

    searchPerformed(params: {
        location?: string
        type?: string
        minPrice?: number
        maxPrice?: number
    }) {
        this.trackEvent('search', params)
    },

    favoriteAdded(listingId: string) {
        this.trackEvent('add_to_wishlist', {item_id: listingId})
    },

    userRegistered(role: 'PRIVATE' | 'AGENCY') {
        this.trackEvent('sign_up', {method: 'email', user_role: role})
    },

    userLoggedIn(method: 'email' | 'google') {
        this.trackEvent('login', {method})
    },
}