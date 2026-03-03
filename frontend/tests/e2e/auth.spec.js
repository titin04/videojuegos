import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.fill('#email', 'wrong@test.com');
        await page.fill('#password', 'wrongpassword');
        await page.click('button[type="submit"]');

        const alert = page.locator('.MuiAlert-message');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Invalid credentials');
    });

    test('should register a new user and login', async ({ page }) => {
        const timestamp = Date.now();
        const email = `testuser_${timestamp}@example.com`;

        await page.click('text=Regístrate');
        await expect(page).toHaveURL(/\/register/);

        await page.fill('#name', 'Test User');
        await page.fill('#email', email);
        await page.fill('#password', 'Password123!');
        await page.click('button[type="submit"]');

        // Should redirect to home after successful registration/login
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator('h6', { hasText: 'Video' }).first()).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.fill('#email', 'admin@test.com');
        await page.fill('#password', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/$/);

        // Logout using data-testid
        await page.getByTestId('logout-button').click({ force: true });
        await page.waitForURL(/\/login/);
        expect(page.url()).toContain('/login');

        // Try to go back to home - should be redirected to login
        await page.goto('/');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect protected routes to login', async ({ page }) => {
        await page.goto('/add');
        await expect(page).toHaveURL('/login');

        await page.goto('/mine');
        await expect(page).toHaveURL('/login');
    });
});
