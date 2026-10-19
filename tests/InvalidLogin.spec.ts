
import { test, expect, type Locator } from '@playwright/test';



test('TC 007 - Verify invalid login validation', async ({ page }) => {
    test.setTimeout(60000);

    console.log('STEP 1: Opening OrangeHRM login page');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
});