import {DatabaseSync} from './sync-databases'

// Esegui ogni ora
async function run() {
    const sync = new DatabaseSync()

    try {
        await sync.syncAll()

        // Log risultato
        console.log(`[${new Date().toISOString()}] Sync completato`)
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Errore sync:`, error)

        // Notifica admin
        // await sendAlertEmail('Sync fallito')
    }
}

run()