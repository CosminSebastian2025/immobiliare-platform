'use client'

import {Component, ErrorInfo, ReactNode} from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

export class SentryErrorBoundary extends Component<Props> {
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        Sentry.captureException(error, {contexts: {react: errorInfo}})
    }

    render() {
        if (this.state?.hasError) {
            return this.props.fallback || <div>Errore</div>
        }
        return this.props.children
    }
}