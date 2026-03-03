import { test, expect } from '@playwright/test';

test.describe('Game Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin for all game tests
        await page.goto('/login');
        await page.fill('#email', 'admin@test.com');
        await page.fill('#password', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/$/);
    });

    test('should list games and show details', async ({ page }) => {
        // Check if at least one game card is visible
        const gameCard = page.locator('.MuiCard-root').first();
        await expect(gameCard).toBeVisible();

        // Check for core elements in card
        await expect(gameCard.locator('h3')).toBeVisible(); // Title
        await expect(gameCard.locator('text=€')).toBeVisible(); // Price

        // Open detail
        await gameCard.click();
        const dialog = page.getByRole('dialog').first(); // Should be the only visible dialog
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('h4')).toBeVisible(); // Title in detail
    });

    test('should filter games by search', async ({ page }) => {
        const searchTerm = 'Street Fighter';
        await page.fill('input[placeholder*="Buscar"]', searchTerm);

        // Wait for the list to update (loading indicator or delay)
        await page.waitForTimeout(1000);

        const cards = page.locator('.MuiCard-root');
        const count = await cards.count();

        for (let i = 0; i < count; i++) {
            const text = await cards.nth(i).textContent();
            expect(text?.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
    });

    test('should filter games by category', async ({ page }) => {
        // Click on "Aventura" category
        await page.getByRole('button', { name: 'Aventura' }).first().click();

        // Wait for the loader to appear and then disappear, or just wait for the count to be "6"
        await page.waitForFunction(() => {
            const el = document.querySelector('body');
            return el && el.textContent.includes('Mostrando 6 de 6');
        }, { timeout: 10000 });

        // Results should be visible
        await expect(page.locator('.MuiCard-root')).toBeVisible();
    });

    test('should handle pagination', async ({ page }) => {
        const pagination = page.locator('.MuiPagination-root');
        await expect(pagination).toBeVisible();

        // Check if there's more than one page
        const page2Button = pagination.locator('button[aria-label="Go to page 2"]');
        if (await page2Button.isVisible()) {
            const firstGameBefore = await page.locator('.MuiCard-root h3').first().textContent();
            await page2Button.click();
            await page.waitForTimeout(1000);
            const firstGameAfter = await page.locator('.MuiCard-root h3').first().textContent();
            expect(firstGameBefore).not.toBe(firstGameAfter);
        }
    });

    test('should create, find, and delete a game', async ({ page }) => {
        const gameName = `E2E Test Game ${Date.now()}`;

        // Go to "Alta" (Nuevo)
        await page.click('text=Nuevo');
        await expect(page).toHaveURL(/\/add/);

        // Fill form
        await page.fill('input[name="nombre"]', gameName);
        await page.fill('input[name="compania"]', 'E2E Corp');
        await page.fill('input[name="precio"]', '59.99');
        await page.fill('input[name="fechaLanzamiento"]', '2025-01-01');
        await page.fill('textarea[name="descripcion"]', 'This is a test game created by E2E tests.');
        await page.fill('input[name="imagenUrl"]', 'https://via.placeholder.com/400x600?text=E2E+Game');
        await page.fill('input[name="videoUrl"]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

        // Select categories/platforms (using first chips)
        await page.locator('.MuiChip-root', { hasText: 'Aventura' }).first().click().catch(() => { });
        await page.locator('.MuiChip-root', { hasText: 'PC' }).first().click().catch(() => { });

        await page.click('button:has-text("Crear Videojuego")');

        // Should redirect to home
        await expect(page).toHaveURL(/\/$/);

        // Find the new game using search
        await page.fill('input[placeholder*="Buscar"]', gameName);
        await page.waitForTimeout(1000);
        await expect(page.locator('.MuiCard-root h3', { hasText: gameName })).toBeVisible();

        // Delete the game
        await page.click(`.MuiCard-root:has-text("${gameName}")`);
        await page.click('button:has-text("Borrar")');

        // Wait for the game to be removed from the list
        await page.fill('input[placeholder*="Buscar"]', gameName);
        await page.waitForTimeout(1000);
        await expect(page.locator('.MuiCard-root h3', { hasText: gameName })).not.toBeVisible();
    });
});
