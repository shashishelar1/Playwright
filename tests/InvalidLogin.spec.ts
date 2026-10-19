
import { test, expect, type Locator } from '@playwright/test';

async function highlight(locator: Locator): Promise<void> {
    await locator.evaluate((el: HTMLElement) => {
        el.style.outline = '3px solid orange';
        el.style.backgroundColor = '#fff4cc';
    });
}

test('TC 007 - Verify invalid login validation', async ({ page }) => {
    test.setTimeout(60000);

    console.log('STEP 1: Opening OrangeHRM login page');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    console.log('STEP 2: Entering invalid username');
    const username = page.locator('input[name="username"]');
    await expect(username).toBeVisible();
    await highlight(username);
    await username.pressSequentially('WrongUser', { delay: 200 });

    console.log('STEP 3: Entering invalid password');
    const password = page.locator('input[name="password"]');
    await highlight(password);
    await password.pressSequentially('WrongPassword123', { delay: 200 });

    console.log('STEP 4: Clicking Login');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await highlight(loginButton);
    await loginButton.click();

    console.log('STEP 5: Verifying error message');
    const errorMessage = page.locator('.oxd-alert-content-text');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid credentials');

    console.log('STEP 6: Verifying login was rejected');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(username).toBeVisible();

    console.log('PASS: Invalid credentials correctly rejected');
});