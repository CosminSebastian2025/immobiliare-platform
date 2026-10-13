import { test, expect } from '@playwright/test'

test.describe('Autenticazione', () => {
    test('login con credenziali valide', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[type="email"]', 'admin@immobiliare.it')
        await page.fill('input[type="password"]', 'admin123')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/dashboard')
    })

    test('login con credenziali errate', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[type="email"]', 'wrong@test.it')
        await page.fill('input[type="password"]', 'wrong')
        await page.click('button[type="submit"]')

        await expect(page.getByText('Email o password non corretti')).toBeVisible()
    })

    test('registrazione nuovo utente', async ({ page }) => {
        await page.goto('/register')

        await page.fill('input[name="name"]', 'Test User')
        await page.fill('input[name="email"]', `test${Date.now()}@test.it`)
        await page.fill('input[name="password"]', 'password123')
        await page.fill('input[name="confirmPassword"]', 'password123')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/login\?registered=true/)
    })
})

test.describe('Annunci', () => {
    test('creazione nuovo annuncio', async ({ page }) => {
        // Login
        await page.goto('/login')
        await page.fill('input[type="email"]', 'test@test.it')
        await page.fill('input[type="password"]', 'password123')
        await page.click('button[type="submit"]')
        await page.waitForURL('/dashboard')

        // Vai a nuovo annuncio
        await page.goto('/listings/new')

        // Step 1: Info base
        await page.fill('input[placeholder*="Titolo"]', 'Appartamento test')
        await page.fill('textarea', 'Descrizione test')
        await page.click('text=Continua')

        // Step 2: Posizione
        await page.selectOption('select >> nth=0', 'Lombardia')
        await page.fill('input[placeholder="MI"]', 'MI')
        await page.fill('input[placeholder="Milano"]', 'Milano')
        await page.click('text=Continua')

        // Altri step...
        // (semplificato)
    })
})