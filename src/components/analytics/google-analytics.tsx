'use client'

import {usePathname, useSearchParams} from 'next/navigation'
import {Suspense, useEffect} from 'react'
import {GoogleAnalytics as GA} from '@next/third-parties/google'

function PageViewTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (pathname && typeof window !== 'undefined' && window.gtag) {
            const url = searchParams.toString()
                ? `${pathname}?${searchParams.toString()}`
                : pathname

            window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
                page_path: url,
            })

            // Eventi custom
            if (pathname.startsWith('/listing/')) {
                window.gtag('event', 'view_listing', {
                    page_path: url,
                })
            }

            if (pathname.startsWith('/search')) {
                window.gtag('event', 'search', {
                    search_term: searchParams.get('location') || '',
                })
            }
        }
    }, [pathname, searchParams])

    return null
}

export function GoogleAnalytics() {
    if (!process.env.NEXT_PUBLIC_GA_ID) return null

    return (
        <>
            <GA gaId={process.env.NEXT_PUBLIC_GA_ID}/>
            <Suspense fallback={null}>
                <PageViewTracker/>
            </Suspense>
        </>
    )
}