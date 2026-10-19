
import { test, expect } from '@playwright/test';

test('Verify login with valid credentials', async ({ page }) => {

    // 1. Open the login page
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter username
    await page.locator('[data-test="username"]')
        .fill('standard_user');

    // 3. Enter password
    await page.locator('[data-test="password"]')
        .fill('secret_sauce');

    // 4. Click Login
    await page.locator('[data-test="login-button"]').click();

    // 5. Verify successful navigation
    await expect(page).toHaveURL(/inventory\.html/);

    // 6. Verify Products heading
    await expect(
        page.getByText('Products', { exact: true })
    ).toBeVisible();

    // 7. Verify at least one product is visible
    await expect(page.locator('.inventory_item').first())
        .toBeVisible();

    console.log('Login successful!');

    await page.waitForTimeout(10000)
});

// test('Verify login with invalid credentials', async ({ page }) => {

//     // 1. Open the login page
//     await page.goto('https://www.saucedemo.com/');

//     // 2. Enter invalid credentials
//     await page.locator('[data-test="username"]')
//         .fill('wrong_user');

//     await page.locator('[data-test="password"]')
//         .fill('wrong_password');

//     // 3. Click Login
//     await page.locator('[data-test="login-button"]').click();

//     // 4. Verify error message
//     await expect(page.locator('[data-test="error"]'))
//         .toBeVisible();

//     await expect(page.locator('[data-test="error"]'))
//         .toContainText('Username and password do not match');

//     console.log('Invalid login handled correctly!');

//     await page.waitForTimeout(10000)
// });
