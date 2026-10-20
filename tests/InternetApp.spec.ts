
import { test, expect } from '@playwright/test';

test.setTimeout(180_000);

test('The Internet - Complete UI Automation Test', async ({ page }) => {
    const startTime = Date.now();
    const minimumDuration = 120_000;
    const baseUrl = 'https://the-internet.herokuapp.com';

    // Step 1: Open the application
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    await expect(
        page.getByRole('heading', { name: /welcome to the-internet/i })
    ).toBeVisible();

    await page.waitForTimeout(3000);

    // Step 2: Test checkboxes
    await page.goto(`${baseUrl}/checkboxes`);

    const checkboxes = page.locator(
        'input[type="checkbox"]'
    );

    await expect(checkboxes).toHaveCount(2);

    await checkboxes.nth(0).check();
    await expect(checkboxes.nth(0)).toBeChecked();

    await checkboxes.nth(1).uncheck();
    await expect(checkboxes.nth(1)).not.toBeChecked();

    console.log('PASS: Checkbox validation');
    await page.waitForTimeout(5000);

    // Step 3: Test dropdown
    await page.goto(`${baseUrl}/dropdown`);

    const dropdown = page.locator('#dropdown');

    await expect(dropdown).toBeVisible();

    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');

    await page.waitForTimeout(2000);

    await dropdown.selectOption('2');
    await expect(dropdown).toHaveValue('2');

    console.log('PASS: Dropdown validation');
    await page.waitForTimeout(5000);

    // Step 4: Test JavaScript alert
    await page.goto(`${baseUrl}/javascript_alerts`);

    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        await dialog.accept();
    });

    await page.getByRole('button', {
        name: 'Click for JS Alert',
    }).click();

    await expect(
        page.locator('#result')
    ).toHaveText('You successfully clicked an alert');

    console.log('PASS: JavaScript alert');
    await page.waitForTimeout(4000);

    // Step 5: Test JavaScript confirmation - dismiss
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.dismiss();
    });

    await page.getByRole('button', {
        name: 'Click for JS Confirm',
    }).click();

    await expect(page.locator('#result'))
        .toHaveText('You clicked: Cancel');

    console.log('PASS: JavaScript confirmation');
    await page.waitForTimeout(4000);

    // Step 6: Test JavaScript prompt
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.accept('Playwright TypeScript');
    });

    await page.getByRole('button', {
        name: 'Click for JS Prompt',
    }).click();

    await expect(page.locator('#result')).toHaveText(
        'You entered: Playwright TypeScript'
    );

    console.log('PASS: JavaScript prompt');
    await page.waitForTimeout(5000);

    // Step 7: Test dynamic controls - remove checkbox
    await page.goto(`${baseUrl}/dynamic_controls`);

    const removeButton = page.getByRole('button', {
        name: 'Remove',
    });

    await expect(removeButton).toBeVisible();

    await removeButton.click();

    await expect(
        page.getByText("It's gone!", { exact: true })
    ).toBeVisible({ timeout: 15_000 });

    await expect(
        page.locator('#checkbox')
    ).toHaveCount(0);

    console.log('PASS: Dynamic control removal');
    await page.waitForTimeout(4000);

    // Step 8: Add the checkbox back
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(
        page.getByText("It's back!", { exact: true })
    ).toBeVisible({ timeout: 15_000 });

    await expect(
        page.locator('#checkbox')
    ).toBeVisible();

    console.log('PASS: Dynamic control addition');
    await page.waitForTimeout(5000);

    // Step 9: Test valid login
    await page.goto(`${baseUrl}/login`);

    await expect(
        page.getByRole('heading', { name: 'Login Page' })
    ).toBeVisible();

    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/secure/);

});