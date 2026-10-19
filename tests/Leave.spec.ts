
import { test, expect, type Page, type Locator } from '@playwright/test';

async function highlight(locator: Locator): Promise<void> {
    await locator.evaluate((el: HTMLElement) => {
        el.style.outline = '3px solid orange';
        el.style.backgroundColor = '#fff4cc';
    });
}

test('TC 005 - Verify Leave module', async ({ page }) => {
    test.setTimeout(90000);

    console.log('STEP 1: Opening OrangeHRM');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    console.log('STEP 2: Typing username');
    const username = page.locator('input[name="username"]');
    await expect(username).toBeVisible();
    await highlight(username);
    await username.pressSequentially('Admin', { delay: 200 });

    console.log('STEP 3: Typing password');
    const password = page.locator('input[name="password"]');
    await highlight(password);
    await password.pressSequentially('admin123', { delay: 200 });

    console.log('STEP 4: Login');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);

    console.log('STEP 5: Opening Leave');
    const leave = page.getByRole('link', { name: 'Leave' });
    await highlight(leave);
    await leave.click();

    console.log('STEP 6: Verifying Leave List page');
    await expect(page).toHaveURL(/leave\/viewLeaveList/);
    await expect(
        page.getByRole('heading', { name: 'Leave List' })
    ).toBeVisible();

    console.log('STEP 7: Verifying search controls');
    const searchButton = page.getByRole('button', {
        name: 'Search',
        exact: true
    });

    await expect(searchButton).toBeVisible();
    await highlight(searchButton);

    console.log('STEP 8: Running leave-list search');
    await searchButton.click();
    await expect(page.locator('.oxd-table')).toBeVisible();

    console.log('PASS: Leave module and search verified');
});