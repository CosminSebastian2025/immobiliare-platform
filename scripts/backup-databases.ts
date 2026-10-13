import {exec} from 'child_process'
import {promisify} from 'util'
import {mkdir, writeFile} from 'fs/promises'
import {join} from 'path'
import {mainDb} from '../src/lib/databases'

const execAsync = promisify(exec)

class BackupService {
    private backupDir = join(process.cwd(), 'backups')
    private retentionDays = 30

    async createFullBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupPath = join(this.backupDir, timestamp)

        await mkdir(backupPath, {recursive: true})

        console.log('📦 Creazione backup completo...')

        // 1. Backup PostgreSQL principale
        await this.backupPostgres('main', backupPath)

        // 2. Backup Neon
        await this.backupPostgres('neon', backupPath)

        // 3. Export JSON (utile per migrazioni)
        await this.exportToJson(backupPath)

        // 4. Upload su cloud (opzionale)
        await this.uploadToCloud(backupPath)

        // 5. Pulizia backup vecchi
        await this.cleanupOldBackups()

        console.log('✅ Backup completato')
    }

    async restoreFromBackup(backupPath: string) {
        console.log('♻️ Ripristino da backup...')

        // 1. Restore PostgreSQL
        const sqlFile = join(backupPath, 'main-postgres.sql')
        await execAsync(`psql "${process.env.DATABASE_URL}" < "${sqlFile}"`)

        console.log('✅ Ripristino completato')
    }

    private async backupPostgres(type: 'main' | 'neon', path: string) {
        const url = type === 'main'
            ? process.env.DATABASE_URL
            : process.env.NEON_DATABASE_URL

        if (!url) {
            console.log(`⚠️ ${type} URL non configurato`)
            return
        }

        const filename = join(path, `${type}-postgres.sql`)

        try {
            await execAsync(
                `pg_dump "${url}" --format=plain --no-owner --no-privileges > "${filename}"`
            )
            console.log(`✅ Backup ${type} PostgreSQL: ${filename}`)
        } catch (error) {
            console.error(`❌ Errore backup ${type}:`, error)
        }
    }

    private async exportToJson(path: string) {
        console.log('📝 Export JSON...')

        const data = {
            users: await mainDb.user.findMany({include: {profile: true}}),
            listings: await mainDb.listing.findMany({
                include: {address: true, photos: true}
            }),
            subscriptions: await mainDb.subscription.findMany(),
            payments: await mainDb.payment.findMany(),
            exportedAt: new Date().toISOString(),
            version: '1.0',
        }

        await writeFile(
            join(path, 'full-export.json'),
            JSON.stringify(data, null, 2)
        )

        console.log('✅ Export JSON completato')
    }

    private async uploadToCloud(path: string) {
        // Esempio con AWS S3
        // await s3.upload(...)

        // O con Backblaze B2, Cloudflare R2, etc.
        console.log('☁️ Upload su cloud (implementare)')
    }

    private async cleanupOldBackups() {
        const {stdout} = await execAsync(`ls -la ${this.backupDir}`)

        // Logica per eliminare backup più vecchi di retentionDays
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays)

        console.log(`🗑️ Pulizia backup più vecchi di ${this.retentionDays} giorni`)

        try {
            await execAsync(
                `find ${this.backupDir} -type d -mtime +${this.retentionDays} -exec rm -rf {} +`
            )
        } catch (error) {
            // Ignora se non trova nulla
        }
    }
}

// Esegui
const backup = new BackupService()
backup.createFullBackup()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })