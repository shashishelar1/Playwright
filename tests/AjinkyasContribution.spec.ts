
import { test, expect, type Page, type Locator } from '@playwright/test';

async function pause(page: Page, ms = 1000): Promise<void> {
    await page.waitForTimeout(ms);
}

async function highlight(locator: Locator): Promise<void> {
    await locator.evaluate((el: HTMLElement) => {
        el.style.outline = '3px solid orange';
        el.style.backgroundColor = '#fff4cc';
    });
}

async function login(page: Page): Promise<void> {
    console.log('STEP 1: Opening OrangeHRM');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    console.log('STEP 2: Entering username');
    const username = page.locator('input[name="username"]');
    await expect(username).toBeVisible();
    await highlight(username);
    await username.pressSequentially('Admin', { delay: 200 });

    console.log('STEP 3: Entering password');
    const password = page.locator('input[name="password"]');
    await highlight(password);
    await password.pressSequentially('admin123', { delay: 200 });

    console.log('STEP 4: Logging in');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);
    await pause(page);
}

test('TC 003 - Search employees in PIM', async ({ page }) => {
    test.setTimeout(90000);
    await login(page);

    console.log('STEP 5: Opening PIM');
    const pim = page.getByRole('link', { name: 'PIM' });
    await highlight(pim);
    await pim.click();

    await expect(page).toHaveURL(/pim/);
    await expect(
        page.getByRole('heading', { name: 'Employee Information' })
    ).toBeVisible();

    console.log('STEP 6: Entering employee search text');
    const nameField = page.getByPlaceholder('Type for hints...').first();
    await expect(nameField).toBeVisible();
    await highlight(nameField);
    await nameField.pressSequentially('Admin', { delay: 200 });
    await pause(page, 1500);

    // Select the autocomplete suggestion if the demo provides one.
    const suggestion = page.locator('.oxd-autocomplete-option')
        .filter({ hasText: 'Admin' });

    if (await suggestion.count() > 0) {
        await suggestion.first().click();
    } else {
        // Clear the name if no matching suggestion is available.
        await nameField.clear();
    }

    console.log('STEP 7: Clicking Search');
    const searchButton = page.getByRole('button', {
        name: 'Search',
        exact: true
    });
    await highlight(searchButton);
    await searchButton.click();

    console.log('STEP 8: Verifying employee results table');
    await expect(page.locator('.oxd-table')).toBeVisible();

    console.log('PASS: Employee search workflow completed');
});