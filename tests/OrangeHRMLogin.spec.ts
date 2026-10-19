
import { test, expect, type Page, type Locator } from '@playwright/test';

test('OrangeHRM Login - Slow Step-by-Step Execution', async ({ page }) => {
    test.setTimeout(90000);
    page.setDefaultTimeout(15000);

    // Helper: highlight an element
    async function highlight(locator: Locator, color = 'orange'): Promise<void> {
        await locator.evaluate((element: HTMLElement, outlineColor: string) => {
            element.style.outline = `3px solid ${outlineColor}`;
            element.style.backgroundColor = '#fff4cc';
        }, color);
    }

    // Helper: pause so actions are easy to observe
    async function pause(page: Page, milliseconds = 1000): Promise<void> {
        await page.waitForTimeout(milliseconds);
    }

    console.log('STEP 1: Opening OrangeHRM login page');

    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
        { waitUntil: 'domcontentloaded' }
    );

    await page.setViewportSize({ width: 1366, height: 768 });
    await pause(page, 1500);

    // STEP 2: Username
    console.log('STEP 2: Locating username field');

    const username = page.locator('input[name="username"]');

    await expect(username).toBeVisible();
    await highlight(username);
    await username.click();
    await pause(page, 500);

    console.log('STEP 3: Typing username character by character');

    await username.pressSequentially('Admin', { delay: 250 });
    await pause(page, 1000);

    // STEP 4: Password
    console.log('STEP 4: Locating password field');

    const password = page.locator('input[name="password"]');

    await expect(password).toBeVisible();
    await highlight(password);
    await password.click();
    await pause(page, 500);

    console.log('STEP 5: Typing password character by character');

    await password.pressSequentially('admin123', { delay: 250 });
    await pause(page, 1000);

    // STEP 6: Login
    console.log('STEP 6: Highlighting Login button');

    const loginButton = page.getByRole('button', { name: 'Login' });

    await expect(loginButton).toBeVisible();
    await highlight(loginButton, 'green');
    await pause(page, 1000);

    console.log('STEP 7: Clicking Login');

    await loginButton.click();

    // STEP 8: Verify dashboard
    console.log('STEP 8: Verifying dashboard');

    await expect(page).toHaveURL(/dashboard/);

    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    await pause(page, 1500);

    console.log('PASS: OrangeHRM login successful');
});