'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowLeft, Paperclip } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface Props {
    messages: any[]
    otherUser: any
    currentUserId: string
}

export function ChatWindow({ messages: initialMessages, otherUser, currentUserId }: Props) {
    const router = useRouter()
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: otherUser.id,
                    content: newMessage,
                }),
            })

            if (res.ok) {
                const message = await res.json()
                setMessages([...messages, message])
                setNewMessage('')
            }
        } catch (error) {
            console.error('Errore invio:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border overflow-hidden h-[70vh] flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
                <button
                    onClick={() => router.push('/dashboard/messages')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                {otherUser.image ? (
                    <img
                        src={otherUser.image}
                        alt={otherUser.name || ''}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-semibold">
              {otherUser.name?.[0] || otherUser.email[0].toUpperCase()}
            </span>
                    </div>
                )}
                <div>
                    <p className="font-semibold">{otherUser.name || otherUser.email}</p>
                    <p className="text-xs text-gray-500">
                        {otherUser.role === 'AGENCY' ? 'Agenzia' : 'Privato'}
                    </p>
                </div>
            </div>

            {/* Messaggi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p>Inizia la conversazione con {otherUser.name || otherUser.email}</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                    isMine
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {formatDistanceToNow(new Date(msg.createdAt), {
                                        addSuffix: true,
                                        locale: it,
                                    })}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Paperclip className="h-5 w-5" />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sending}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </div>
    )
}