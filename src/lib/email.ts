import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASSWORD,
    },
})

const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@immobiliare.it'
const FROM_NAME = process.env.FROM_NAME || 'Immobiliare Platform'

interface EmailOptions {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_PASSWORD) {
        console.log('📧 Email (dev mode):')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        console.log(`HTML: ${html.slice(0, 200)}...`)
        return
    }

    await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to,
        subject,
        html,
    })
}

// Templates email

export async function sendWelcomeEmail(user: any) {
    await sendEmail({
        to: user.email,
        subject: 'Benvenuto su Immobiliare Platform!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Benvenuto, ${user.name || 'utente'}! 👋</h1>
        <p>Grazie per esserti registrato su Immobiliare Platform.</p>
        <p>Ora puoi:</p>
        <ul>
          <li>Pubblicare i tuoi annunci immobiliari</li>
          <li>Ricevere richieste di visita</li>
          <li>Gestire tutto dalla tua dashboard</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Vai alla dashboard
        </a>
      </div>
    `,
    })
}

export async function sendNewInquiryEmail(listing: any, inquiry: any) {
    await sendEmail({
        to: listing.user.email,
        subject: `Nuova richiesta per: ${listing.title}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nuova richiesta ricevuta</h1>
        <p>Hai ricevuto una nuova richiesta per il tuo annuncio:</p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${listing.title}</strong>
          <p style="color: #6b7280; font-size: 14px;">${listing.address?.city || ''}</p>
        </div>
        <h3>Dati del richiedente:</h3>
        <p><strong>Nome:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        ${inquiry.phone ? `<p><strong>Telefono:</strong> ${inquiry.phone}</p>` : ''}
        <p><strong>Messaggio:</strong></p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
          ${inquiry.message}
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Rispondi dalla dashboard
        </a>
      </div>
    `,
    })
}

export async function sendNewMessageEmail(receiver: any, sender: any, content: string) {
    await sendEmail({
        to: receiver.email,
        subject: `Nuovo messaggio da ${sender.name || sender.email}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nuovo messaggio 💬</h1>
        <p>Hai ricevuto un nuovo messaggio da <strong>${sender.name || sender.email}</strong>:</p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
          ${content}
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages/${sender.id}" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Rispondi
        </a>
      </div>
    `,
    })
}

export async function sendModerationEmail(listing: any, action: string, reason?: string) {
    const isApproved = action === 'approve'

    await sendEmail({
        to: listing.user.email,
        subject: isApproved
            ? `✓ Il tuo annuncio "${listing.title}" è stato approvato`
            : `✗ Il tuo annuncio "${listing.title}" è stato rifiutato`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${isApproved ? '#10b981' : '#ef4444'};">
          ${isApproved ? 'Annuncio approvato ✓' : 'Annuncio rifiutato ✗'}
        </h1>
        <p>Il tuo annuncio <strong>"${listing.title}"</strong> ${
            isApproved ? 'è stato approvato ed è ora visibile pubblicamente.' : 'è stato rifiutato dal nostro team.'
        }</p>
        ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/listings" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Vai alla dashboard
        </a>
      </div>
    `,
    })
}

export async function sendSubscriptionEmail(user: any, plan: any) {
    await sendEmail({
        to: user.email,
        subject: `Benvenuto nel piano ${plan.name}!`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Iscrizione confermata 🎉</h1>
        <p>Hai attivato il piano <strong>${plan.name}</strong>.</p>
        <p>Ora hai accesso a tutti i vantaggi del piano:</p>
        <ul>
          ${plan.features.map((f: string) => `<li>${f}</li>`).join('')}
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Inizia subito
        </a>
      </div>
    `,
    })
}