import { test, expect } from '@playwright/test';

test('Verify login with invalid credentials', async ({ page }) => {

    // 1. Open the login page
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter invalid credentials
    await page.locator('[data-test="username"]')
        .fill('wrong_user');

    await page.locator('[data-test="password"]')
        .fill('wrong_password');

    // 3. Click Login
    await page.locator('[data-test="login-button"]').click();

    // 4. Verify error message
    await expect(page.locator('[data-test="error"]'))
        .toBeVisible();

    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match');

    console.log('Invalid login handled correctly!');

    await page.waitForTimeout(10000)
});