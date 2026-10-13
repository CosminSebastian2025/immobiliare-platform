import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Modelli disponibili
export const MODELS = {
    FAST: 'gpt-4o-mini',      // Veloce ed economico
    BALANCED: 'gpt-4o',       // Buon bilanciamento
    POWERFUL: 'gpt-4-turbo',  // Massima qualità
}

// Cache per evitare chiamate duplicate
const cache = new Map<string, { result: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 ora

export async function generateWithCache<T>(
    key: string,
    fn: () => Promise<T>
): Promise<T> {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.result as T
    }

    const result = await fn()
    cache.set(key, {result, timestamp: Date.now()})
    return result
}