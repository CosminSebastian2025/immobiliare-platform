'use client'

import {useState} from 'react'
import {Sparkles, X} from 'lucide-react'

interface Props {
    context: string
    onInsert?: (text: string) => void
}

export function AIAssistantButton({context, onInsert}: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string>('')

    const actions = [
        {label: '✨ Migliora descrizione', action: 'enhance'},
        {label: '🌍 Traduci in inglese', action: 'translate-en'},
        {label: '🔍 Genera SEO keywords', action: 'seo'},
        {label: '📝 Suggerisci titolo', action: 'title'},
    ]

    const handleAction = async (action: string) => {
        setLoading(true)
        try {
            const res = await fetch('/api/ai/assist', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action, context}),
            })
            const data = await res.json()
            setResult(data.result)
        } catch (error) {
            setResult('Errore. Riprova.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
                <Sparkles className="h-4 w-4"/>
                AI Assistant
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-64 bg-white rounded-xl shadow-xl border p-2">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <span className="font-semibold text-sm">Assistente AI</span>
                        <button onClick={() => setOpen(false)}>
                            <X className="h-4 w-4"/>
                        </button>
                    </div>

                    <div className="space-y-1">
                        {actions.map((a) => (
                            <button
                                key={a.action}
                                onClick={() => handleAction(a.action)}
                                disabled={loading}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    {result && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-2">Risultato:</p>
                            <p className="text-sm whitespace-pre-wrap">{result}</p>
                            {onInsert && (
                                <button
                                    onClick={() => {
                                        onInsert(result)
                                        setOpen(false)
                                    }}
                                    className="mt-2 w-full text-xs bg-purple-600 text-white py-1.5 rounded"
                                >
                                    Inserisci
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}