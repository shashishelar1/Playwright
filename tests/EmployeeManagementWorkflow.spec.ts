
import { test, expect, type Page, type Locator } from '@playwright/test';

test('TC_ORANGEHRM_002 - Employee Management Workflow', async ({ page }) => {
    test.setTimeout(120000);
    page.setDefaultTimeout(15000);

    // Reusable helper: display each step in the terminal
    async function step(message: string): Promise<void> {
        console.log(`\n${message}`);
        await page.waitForTimeout(1000);
    }

    // Reusable helper: highlight fields and buttons
    async function highlight(locator: Locator): Promise<void> {
        await locator.evaluate((element: HTMLElement) => {
            element.style.outline = '3px solid orange';
            element.style.backgroundColor = '#fff4cc';
        });
    }

    // Reusable helper: type text slowly
    async function slowType(
        locator: Locator,
        value: string
    ): Promise<void> {
        await locator.click();
        await locator.pressSequentially(value, { delay: 150 });
    }

    // STEP 1: Open OrangeHRM
    await step('STEP 1: Opening OrangeHRM login page');

    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
        { waitUntil: 'domcontentloaded' }
    );

    await expect(
        page.locator('input[name="username"]')
    ).toBeVisible();

    // STEP 2: Enter username
    await step('STEP 2: Entering username');

    const username = page.locator('input[name="username"]');
    await highlight(username);
    await slowType(username, 'Admin');

    // STEP 3: Enter password
    await step('STEP 3: Entering password');

    const password = page.locator('input[name="password"]');
    await highlight(password);
    await slowType(password, 'admin123');

    // STEP 4: Login
    await step('STEP 4: Clicking Login');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await highlight(loginButton);
    await loginButton.click();

    // STEP 5: Verify dashboard
    await step('STEP 5: Verifying Dashboard');

    await expect(page).toHaveURL(/dashboard/);
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    console.log('PASS: Dashboard loaded successfully');

    // STEP 6: Open PIM module
    await step('STEP 6: Opening PIM module');

    const pimMenu = page.getByRole('link', { name: 'PIM' });
    await expect(pimMenu).toBeVisible();
    await highlight(pimMenu);
    await pimMenu.click();

    await expect(page).toHaveURL(/pim/);

    await expect(
        page.getByRole('heading', { name: 'PIM' })
    ).toBeVisible();

    console.log('PASS: PIM module opened');

    // STEP 7: Verify employee information section
    await step('STEP 7: Verifying Employee Information');

    await expect(
        page.getByRole('heading', { name: 'Employee Information' })
    ).toBeVisible();

    // STEP 8: Verify the employee search form
    await step('STEP 8: Checking employee search fields');

    const employeeName = page.getByPlaceholder('Type for hints...');
    await expect(employeeName.first()).toBeVisible();

    const searchButton = page.getByRole('button', {
        name: 'Search',
        exact: true
    });

    await expect(searchButton).toBeVisible();
    await highlight(searchButton);

    console.log('PASS: Employee search form is visible');

    // STEP 9: Search using empty criteria
    // This avoids assuming a particular employee exists in the demo.
    await step('STEP 9: Searching employee records');

    await searchButton.click();

    // Wait for the search request and results to settle.
    const employeeTable = page.locator('.oxd-table');
    await expect(employeeTable.first()).toBeVisible();

    console.log('PASS: Employee results table is visible');

    // STEP 10: Verify table structure
    await step('STEP 10: Verifying employee table');

    await expect(
        page.locator('.oxd-table-header')
    ).toBeVisible();

    await expect(
        page.getByRole('columnheader', { name: /Name/i }).first()
    ).toBeVisible();

    console.log('PASS: Employee table headers are visible');

    // STEP 11: Open Admin module
    await step('STEP 11: Opening Admin module');

    const adminMenu = page.getByRole('link', {
        name: 'Admin',
        exact: true
    });

    await expect(adminMenu).toBeVisible();
    await highlight(adminMenu);
    await adminMenu.click();

    await expect(page).toHaveURL(/admin/);

    await expect(
        page.getByRole('heading', { name: 'Admin' })
    ).toBeVisible();

    console.log('PASS: Admin module opened');

    // STEP 12: Verify the user management section
    await step('STEP 12: Verifying user management page');

    await expect(
        page.getByRole('heading', { name: 'System Users' })
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Search', exact: true })
    ).toBeVisible();

    console.log('PASS: System Users page is visible');

    // STEP 13: Return to Dashboard
    await step('STEP 13: Returning to Dashboard');

    const dashboardMenu = page.getByRole('link', {
        name: 'Dashboard',
        exact: true
    });

    await expect(dashboardMenu).toBeVisible();
    await highlight(dashboardMenu);
    await dashboardMenu.click();

    await expect(page).toHaveURL(/dashboard/);

    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    console.log('PASS: Returned to Dashboard');

    // STEP 14: Open the profile menu
    await step('STEP 14: Opening user profile menu');

    const profileMenu = page.locator('.oxd-userdropdown-tab');

    await expect(profileMenu).toBeVisible();
    await highlight(profileMenu);
    await profileMenu.click();

    // STEP 15: Logout
    await step('STEP 15: Logging out');

    const logoutButton = page.getByRole('menuitem', {
        name: 'Logout'
    });

    await expect(logoutButton).toBeVisible();
    await highlight(logoutButton);
    await logoutButton.click();

    // STEP 16: Verify successful logout
    await step('STEP 16: Verifying logout');

    await expect(page).toHaveURL(/auth\/login/);

    await expect(
        page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Login' })
    ).toBeVisible();

    console.log('\n========================================');
    console.log('TEST PASSED: Employee Management Workflow');
    console.log('All workflow assertions completed.');
    console.log('========================================\n');
});