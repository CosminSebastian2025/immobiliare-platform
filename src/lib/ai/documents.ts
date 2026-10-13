import {generateWithCache, MODELS, openai} from '../ai'

// 1. Generazione contratto di locazione
export async function generateRentalContract(data: {
    landlordName: string
    landlordCF: string
    tenantName: string
    tenantCF: string
    propertyAddress: string
    propertyCity: string
    rentAmount: number
    startDate: string
    duration: number // mesi
    contractType: '4+4' | '3+2' | 'transitorio' | 'studenti'
}): Promise<string> {
    const cacheKey = `contract-${JSON.stringify(data)}`

    return generateWithCache(cacheKey, async () => {
        const response = await openai.chat.completions.create({
            model: MODELS.BALANCED,
            messages: [
                {
                    role: 'system',
                    content: `Sei un esperto legale italiano specializzato in contratti di locazione. 
          Genera contratti conformi alla legge italiana (L. 431/98 e successive modifiche).
          Usa un linguaggio formale e giuridicamente corretto.
          Struttura il contratto con articoli numerati e commi.`,
                },
                {
                    role: 'user',
                    content: `Genera un contratto di locazione ${data.contractType} con i seguenti dati:
          
LOCATORE: ${data.landlordName} (CF: ${data.landlordCF})
CONDUTTORE: ${data.tenantName} (CF: ${data.tenantCF})
IMMOBILE: ${data.propertyAddress}, ${data.propertyCity}
CANONE: €${data.rentAmount} mensili
DURATA: ${data.duration} mesi a partire dal ${data.startDate}

Il contratto deve includere:
1. Parti contraenti
2. Oggetto del contratto (descrizione immobile)
3. Durata e rinnovo
4. Canone e modalità di pagamento
5. Deposito cauzionale (3 mensilità standard)
6. Oneri accessori (spese condominiali)
7. Destinazione d'uso
8. Obblighi del locatore
9. Obblighi del conduttore
10. Divieto di sublocazione
11. Risoluzione anticipata
12. Registrazione del contratto
13. Privacy (GDPR)
14. Foro competente

Formatta in HTML con <h2> per sezioni e <p> per paragrafi.`,
                },
            ],
            temperature: 0.3,
            max_tokens: 4000,
        })

        return response.choices[0].message.content || ''
    })
}

// 2. Calcolo cedolare secca
export async function calculateCedolareSecca(data: {
    annualRent: number
    contractType: 'libero' | 'concordato'
    propertyCategory: 'A1' | 'A2' | 'A3' | 'altro'
}): Promise<{
    aliquota: number
    imposta: number
    risparmioVsIRPEF: number
    note: string
}> {
    const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
            {
                role: 'system',
                content: `Sei un commercialista italiano esperto di fiscalità immobiliare. 
        Rispondi SOLO con un oggetto JSON valido.`,
            },
            {
                role: 'user',
                content: `Calcola la cedolare secca per:
- Canone annuo: €${data.annualRent}
- Tipo contratto: ${data.contractType}
- Categoria catastale: ${data.propertyCategory}

Restituisci JSON con:
{
  "aliquota": number (21% per libero, 10% per concordato),
  "imposta": number,
  "risparmioVsIRPEF": number (stima vs IRPEF 23%),
  "note": string (spiegazione breve)
}`,
            },
        ],
        response_format: {type: 'json_object'},
        temperature: 0,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}

// 3. Generazione descrizione annuncio ottimizzata
export async function generateListingDescription(data: {
    title: string
    propertyType: string
    city: string
    rooms: number
    sqm: number
    features: string[]
    highlights: string
}): Promise<{
    shortDescription: string
    longDescription: string
    seoKeywords: string[]
}> {
    const response = await openai.chat.completions.create({
        model: MODELS.BALANCED,
        messages: [
            {
                role: 'system',
                content: `Sei un copywriter immobiliare esperto di SEO. 
        Scrivi descrizioni accattivanti e ottimizzate per i motori di ricerca.
        Rispondi in JSON.`,
            },
            {
                role: 'user',
                content: `Genera descrizione per annuncio immobiliare:
        
Titolo: ${data.title}
Tipo: ${data.propertyType}
Città: ${data.city}
Locali: ${data.rooms}
Superficie: ${data.sqm} m²
Caratteristiche: ${data.features.join(', ')}
Punti di forza: ${data.highlights}

Restituisci JSON:
{
  "shortDescription": "max 150 caratteri per anteprima",
  "longDescription": "300-500 parole, HTML semplice con <p> e <ul>",
  "seoKeywords": ["array di 10 keyword per SEO"]
}`,
            },
        ],
        response_format: {type: 'json_object'},
        temperature: 0.7,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}

// 4. Compilazione automatica modulo RLI (registrazione contratto)
export async function generateRLIData(contract: any): Promise<string> {
    const response = await openai.chat.completions.create({
        model: MODELS.BALANCED,
        messages: [
            {
                role: 'system',
                content: `Sei un esperto di adempimenti fiscali per locazioni in Italia.
        Aiuta a compilare il modello RLI per la registrazione dei contratti all'Agenzia delle Entrate.`,
            },
            {
                role: 'user',
                content: `Basandoti su questo contratto, genera le istruzioni passo-passo per compilare il modello RLI:
        
${JSON.stringify(contract)}

Includi:
1. Codici tributo da usare
2. Importi F24
3. Scadenze
4. Documenti da allegare
5. Procedura online (Fisconline/Entratel)`,
            },
        ],
        temperature: 0.3,
    })

    return response.choices[0].message.content || ''
}

// 5. Generazione APE placeholder
export async function generateAPEPlaceholder(data: {
    address: string
    sqm: number
    yearBuilt: number
    heatingType: string
}): Promise<string> {
    const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
            {
                role: 'system',
                content: `Sei un tecnico abilitato per la certificazione energetica degli edifici.
        Genera una stima indicativa della classe energetica basata sui dati forniti.
        IMPORTANTE: specifica che è solo una stima e serve un tecnico abilitato per il certificato ufficiale.`,
            },
            {
                role: 'user',
                content: `Stima indicativa classe energetica:
- Indirizzo: ${data.address}
- Superficie: ${data.sqm} m²
- Anno costruzione: ${data.yearBuilt}
- Tipo riscaldamento: ${data.heatingType}

Rispondi con:
1. Classe energetica stimata (A4-G)
2. EPgl stimato (kWh/m² anno)
3. Raccomandazioni per miglioramento
4. Disclaimer sulla necessità di tecnico abilitato`,
            },
        ],
        temperature: 0.2,
    })

    return response.choices[0].message.content || ''
}

// 6. Generazione privacy policy e termini personalizzati
export async function generateLegalDocuments(companyData: {
    companyName: string
    vatNumber: string
    address: string
    email: string
    website: string
}): Promise<{
    privacyPolicy: string
    termsOfService: string
    cookiePolicy: string
}> {
    const response = await openai.chat.completions.create({
        model: MODELS.BALANCED,
        messages: [
            {
                role: 'system',
                content: `Sei un avvocato italiano specializzato in diritto digitale e GDPR.
        Genera documenti legali conformi alla normativa italiana ed europea.
        Rispondi in JSON con HTML formattato.`,
            },
            {
                role: 'user',
                content: `Genera i seguenti documenti legali per un portale immobiliare:

DATI AZIENDA:
- Ragione sociale: ${companyData.companyName}
- P.IVA: ${companyData.vatNumber}
- Indirizzo: ${companyData.address}
- Email: ${companyData.email}
- Sito: ${companyData.website}

Il portale permette:
- Pubblicazione annunci immobiliari
- Contatto tra privati e agenzie
- Gestione abbonamenti a pagamento

Restituisci JSON con:
{
  "privacyPolicy": "HTML completo GDPR compliant",
  "termsOfService": "HTML termini di servizio",
  "cookiePolicy": "HTML cookie policy con elenco cookie"
}`,
            },
        ],
        response_format: {type: 'json_object'},
        temperature: 0.2,
        max_tokens: 4000,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}

// 7. Traduzione automatica annunci
export async function translateListing(
    content: { title: string; description: string },
    targetLang: 'en' | 'de' | 'fr' | 'es' | 'zh'
): Promise<{ title: string; description: string }> {
    const langNames: Record<string, string> = {
        en: 'inglese', de: 'tedesco', fr: 'francese', es: 'spagnolo', zh: 'cinese semplificato'
    }

    const response = await openai.chat.completions.create({
        model: MODELS.BALANCED,
        messages: [
            {
                role: 'system',
                content: `Sei un traduttore professionista specializzato in immobiliare.
        Mantieni il tono commerciale e i termini tecnici corretti.
        Rispondi in JSON.`,
            },
            {
                role: 'user',
                content: `Traduci in ${langNames[targetLang]}:
        
                Titolo: ${content.title}
                Descrizione: ${content.description}
                
                JSON: { "title": "...", "description": "..." }`,
            },
        ],
        response_format: {type: 'json_object'},
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}

// 8. Analisi automatica immagini (moderazione)
export async function analyzePropertyImage(imageUrl: string): Promise<{
    isProperty: boolean
    quality: 'low' | 'medium' | 'high'
    issues: string[]
    rooms: string[]
    suggestions: string[]
}> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Analizza questa immagine immobiliare e rispondi in JSON con:
                        {
                          "isProperty": boolean (è una foto di immobile?),
                          "quality": "low" | "medium" | "high",
                          "issues": ["problemi rilevati"],
                          "rooms": ["tipo stanze riconoscibili"],
                          "suggestions": ["come migliorare"]
                        }`,
                    },
                    {
                        type: 'image_url',
                        image_url: {url: imageUrl},
                    },
                ],
            },
        ],
        response_format: {type: 'json_object'},
        max_tokens: 500,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}