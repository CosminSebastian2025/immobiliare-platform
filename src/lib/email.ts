import sgMail from '@sendgrid/mail'

// Configurazione SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'no-reply@tuosito.it'
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Immobiliare Platform'

interface EmailOptions {
    to: string
    subject: string
    html: string
    text?: string
    category?: string
}

export async function sendEmail({to, subject, html, text, category}: EmailOptions) {
    if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
        console.log('📧 Email (dev mode):')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        return
    }

    try {
        await sgMail.send({
            to,
            from: {email: FROM_EMAIL, name: FROM_NAME},
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
            categories: category ? [category] : undefined,
            trackingSettings: {
                clickTracking: {enable: true},
                openTracking: {enable: true},
            },
        })
    } catch (error: any) {
        console.error('SendGrid error:', error.response?.body || error)
        // Non throware, l'email non deve bloccare il flusso
    }
}

// Template email professionali

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #2563eb; color: white; padding: 32px 24px; text-align: center; }
  .content { padding: 32px 24px; color: #1f2937; line-height: 1.6; }
  .button { 
    display: inline-block; 
    background: #2563eb; 
    color: white !important; 
    padding: 14px 28px; 
    text-decoration: none; 
    border-radius: 8px; 
    margin: 24px 0;
    font-weight: 500;
  }
  .footer { padding: 24px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  .info-box { background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0; }
`

function emailTemplate(content: string, title: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>${emailStyles}</style>
      </head>
      <body style="background: #f9fafb; margin: 0; padding: 20px 0;">
        <div class="container" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🏠 Immobiliare Platform</h1>
          </div>
          <div class="content">${content}</div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Immobiliare Platform. Tutti i diritti riservati.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Gestisci preferenze email</a> · 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280;">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function sendWelcomeEmail(user: any) {
    const content = `
    <h2 style="color: #1f2937; margin-top: 0;">Benvenuto ${user.name || 'su Immobiliare Platform'}! 👋</h2>
    <p>Siamo felici di averti con noi. Ecco cosa puoi fare subito:</p>
    
    <div class="info-box">
      <strong>✨ Per i privati:</strong>
      <ul>
        <li>Pubblica annunci gratuitamente</li>
        <li>Ricevi richieste di visita</li>
        <li>Salva i tuoi preferiti</li>
      </ul>
    </div>
    
    <div class="info-box">
      <strong>🏢 Per le agenzie:</strong>
      <ul>
        <li>Gestisci tutti i tuoi annunci</li>
        <li>Statistiche avanzate</li>
        <li>Annunci in evidenza</li>
      </ul>
    </div>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Vai alla tua dashboard</a>
    
    <p style="color: #6b7280; font-size: 14px;">Hai domande? Rispondi a questa email, siamo qui per aiutarti!</p>
  `

    await sendEmail({
        to: user.email,
        subject: 'Benvenuto su Immobiliare Platform!',
        html: emailTemplate(content, 'Benvenuto'),
        category: 'welcome',
    })
}

export async function sendNewInquiryEmail(listing: any, inquiry: any) {
    const content = `
    <h2 style="color: #1f2937; margin-top: 0;">Nuova richiesta ricevuta 💬</h2>
    <p>Hai ricevuto una nuova richiesta per il tuo annuncio:</p>
    
    <div class="info-box">
      <strong>${listing.title}</strong><br>
      <span style="color: #6b7280;">${listing.address?.city || ''} · €${(listing.price / 100).toLocaleString('it-IT')}</span>
    </div>
    
    <h3>Dati del richiedente:</h3>
    <p><strong>Nome:</strong> ${inquiry.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    ${inquiry.phone ? `<p><strong>Telefono:</strong> ${inquiry.phone}</p>` : ''}
    
    <h3>Messaggio:</h3>
    <div class="info-box">${inquiry.message}</div>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages" class="button">Rispondi dalla dashboard</a>
  `

    await sendEmail({
        to: listing.user.email,
        subject: `Nuova richiesta per: ${listing.title}`,
        html: emailTemplate(content, 'Nuova richiesta'),
        category: 'inquiry',
    })
}

export async function sendPasswordResetEmail(user: any, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

    const content = `
    <h2 style="color: #1f2937; margin-top: 0;">Reset password</h2>
    <p>Ciao ${user.name || 'utente'},</p>
    <p>Hai richiesto di reimpostare la tua password. Clicca sul pulsante qui sotto per procedere:</p>
    
    <a href="${resetUrl}" class="button">Reimposta password</a>
    
    <p style="color: #6b7280; font-size: 14px;">Il link scadrà tra 1 ora. Se non hai richiesto tu il reset, ignora questa email.</p>
  `

    await sendEmail({
        to: user.email,
        subject: 'Reimposta la tua password',
        html: emailTemplate(content, 'Reset password'),
        category: 'security',
    })
}

export async function sendSubscriptionEmail(user: any, plan: any) {
    const content = `
    <h2 style="color: #10b981; margin-top: 0;">Abbonamento attivato! 🎉</h2>
    <p>Ciao ${user.name || 'utente'},</p>
    <p>Il tuo abbonamento <strong>${plan.name}</strong> è stato attivato con successo.</p>
    
    <div class="info-box">
      <strong>Vantaggi inclusi:</strong>
      <ul>
        ${(plan.features || []).map((f: string) => `<li>✓ ${f}</li>`).join('')}
      </ul>
    </div>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Inizia subito</a>
  `

    await sendEmail({
        to: user.email,
        subject: `Benvenuto nel piano ${plan.name}!`,
        html: emailTemplate(content, 'Abbonamento attivato'),
        category: 'subscription',
    })
}

export async function sendPaymentFailedEmail(user: any, invoice: any) {
    const content = `
    <h2 style="color: #ef4444; margin-top: 0;">Problema con il pagamento ⚠️</h2>
    <p>Ciao ${user.name || 'utente'},</p>
    <p>Non siamo riusciti a elaborare il tuo pagamento di <strong>€${(invoice.amount_due / 100).toFixed(2)}</strong>.</p>
    
    <div class="info-box">
      <strong>Cosa fare:</strong>
      <ol>
        <li>Controlla il tuo metodo di pagamento</li>
        <li>Verifica di avere fondi sufficienti</li>
        <li>Aggiorna i dati della carta se necessario</li>
      </ol>
    </div>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription" class="button">Aggiorna pagamento</a>
    
    <p style="color: #6b7280; font-size: 14px;">Se il problema persiste, contattaci rispondendo a questa email.</p>
  `

    await sendEmail({
        to: user.email,
        subject: 'Azione richiesta: problema con il pagamento',
        html: emailTemplate(content, 'Problema pagamento'),
        category: 'payment',
    })
}

export async function sendEmailVerification(user: any, token: string) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    const content = `
    <h2 style="color: #1f2937; margin-top: 0;">Verifica la tua email ✉️</h2>
    <p>Ciao ${user.name || 'utente'},</p>
    <p>Clicca sul pulsante per confermare il tuo indirizzo email:</p>
    
    <a href="${verifyUrl}" class="button">Verifica email</a>
    
    <p style="color: #6b7280; font-size: 14px;">Il link scadrà tra 24 ore.</p>
  `

    await sendEmail({
        to: user.email,
        subject: 'Verifica il tuo indirizzo email',
        html: emailTemplate(content, 'Verifica email'),
        category: 'verification',
    })
}