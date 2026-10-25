
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('MDMS login with valid credentials and CAPTCHA', async ({ page }) => {
    // 1. Validate credentials are configured
    const username = process.env.MDMS_USERNAME;
    const password = process.env.MDMS_PASSWORD;

    expect(username, 'MDMS_USERNAME must be configured').toBeTruthy();
    expect(password, 'MDMS_PASSWORD must be configured').toBeTruthy();

    // 2. Open the MDMS application
    await page.goto('https://mdm.aeslami-apsp.com/General/Home');

    await expect(page.locator('body')).toBeVisible();

    console.log('MDMS login page opened');

    // 3. Inspect the page to identify the actual login fields
    console.log('Page title:', await page.title());
    console.log('Current URL:', page.url());

    const inputs = page.locator('input');

    for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);

        console.log({
            index: i,
            type: await input.getAttribute('type'),
            name: await input.getAttribute('name'),
            id: await input.getAttribute('id'),
            placeholder: await input.getAttribute('placeholder')
        });
    }

    // 4. Fill the credentials.
    // Update these candidate locators after inspecting the DOM.
    const usernameField = page.locator(
        'input[name="LoginId"], input[name="LoginID"], input[type="text"]'
    ).first();

    const passwordField = page.locator('input[type="password"]').first();

    await usernameField.fill(username!);
    await passwordField.fill(password!);

    console.log('Username and password entered');

    // 5. Pause so you can enter CAPTCHA and complete
    // any required authentication step manually.
    await page.pause();

    // 6. After completing CAPTCHA/OTP, resume the test.
    // Update this locator to match the actual login button.
    const loginButton = page.getByRole('button', {
        name: /login|sign in/i
    });

    await loginButton.click();

    // 7. Inspect the result.
    // Replace with a reliable success assertion once
    // the authenticated page is identified.
    await page.waitForLoadState('domcontentloaded').catch(() => { });

    console.log('URL after login:', page.url());

    await expect(page.locator('body')).toBeVisible();

    console.log('Login flow completed; verify the resulting page.');
});