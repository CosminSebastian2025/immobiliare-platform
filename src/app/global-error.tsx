'use client'

import * as Sentry from '@sentry/nextjs'
import {useEffect} from 'react'

export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return (
        <html>
        <body>
        <div style={{
            fontFamily: 'system-ui',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
        }}>
            <h1 style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</h1>
            <h2>Qualcosa è andato storto</h2>
            <p style={{color: '#666', marginBottom: '24px'}}>
                Si è verificato un errore imprevisto. Il nostro team è stato notificato.
            </p>
            <button
                onClick={reset}
                style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                Riprova
            </button>
        </div>
        </body>
        </html>
    )
}