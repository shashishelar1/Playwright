
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('MDMS login with valid credentials and CAPTCHA', async ({ page }) => {

    // 2. Open the MDMS application
    await page.goto('https://mdm.aeslami-apsp.com/General/Home');

    await page.waitForTimeout(10000)

});