import {expect, test} from '@playwright/test'

test.describe('Flusso utente completo', () => {
    const timestamp = Date.now()
    const testEmail = `test-${timestamp}@example.com`

    test('registrazione → pubblicazione annuncio → contatto', async ({page}) => {
        // 1. Registrazione
        await page.goto('/register')
        await page.fill('input[name="name"]', 'Test User')
        await page.fill('input[name="email"]', testEmail)
        await page.fill('input[name="password"]', 'Password123!')
        await page.fill('input[name="confirmPassword"]', 'Password123!')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/login/)

        // 2. Login
        await page.fill('input[type="email"]', testEmail)
        await page.fill('input[type="password"]', 'Password123!')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/dashboard')

        // 3. Pubblicazione annuncio
        await page.goto('/listings/new')
        await page.fill('input[placeholder*="Titolo"]', 'Test Appartamento')
        await page.fill('textarea', 'Descrizione dettagliata del test appartamento...')
        await page.click('text=Continua')

        // Step posizione
        await page.selectOption('select', 'Lombardia')
        await page.fill('input[placeholder="MI"]', 'MI')
        await page.fill('input[placeholder="Milano"]', 'Milano')
        await page.click('text=Continua')

        // Step dettagli
        await page.fill('input[type="number"]', '3')
        await page.click('text=Continua')

        // Step foto (skip)
        await page.click('text=Continua')

        // Step prezzo
        await page.fill('input[type="number"]', '1200')
        await page.click('text=Continua')

        // Step review + publish
        await page.click('text=Pubblica annuncio')

        await expect(page).toHaveURL('/dashboard/listings')
        await expect(page.getByText('Test Appartamento')).toBeVisible()
    })

    test('ricerca e filtro annunci', async ({page}) => {
        await page.goto('/search')

        // Ricerca
        await page.fill('input[placeholder*="Cerca"]', 'Milano')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/location=Milano/)

        // Filtri
        await page.selectOption('select[name="type"]', 'rent_long')
        await page.click('button:has-text("Applica")')

        await expect(page).toHaveURL(/type=rent_long/)
    })

    test('admin panel access', async ({page}) => {
        // Login come admin
        await page.goto('/login')
        await page.fill('input[type="email"]', 'admin@immobiliare.it')
        await page.fill('input[type="password"]', 'admin123')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/dashboard')

        // Vai a admin
        await page.goto('/admin')
        await expect(page.getByText('Admin Panel')).toBeVisible()
        await expect(page.getByText('Gestione Utenti')).toBeVisible()
    })
})