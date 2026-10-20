
import { test, expect } from '@playwright/test';

test.setTimeout(180_000);

test('Automation Exercise - Stable Product and Cart Test', async ({ page }) => {
    const startTime = Date.now();
    const minimumDuration = 120_000;

    // Log navigation issues for debugging
    page.on('pageerror', error => {
        console.error('Browser page error:', error.message);
    });

    try {
        // Step 1: Navigate directly to Products
        await page.goto('https://www.automationexercise.com/products', {
            waitUntil: 'domcontentloaded',
            timeout: 45_000,
        });

        // Do not rely only on the URL; verify actual page content
        await expect(
            page.getByRole('heading', { name: /all products/i }),
        ).toBeVisible({ timeout: 20_000 });

        await page.waitForTimeout(3000);

        // Step 2: Verify products are displayed
        const productCards = page.locator(
            '.features_items .product-image-wrapper',
        );

        await expect(productCards.first()).toBeVisible();

        const initialCount = await productCards.count();
        expect(initialCount).toBeGreaterThan(0);

        console.log(`Initial products displayed: ${initialCount}`);
        await page.waitForTimeout(3000);

        // Step 3: Search for Blue Top
        await page.locator('#search_product').fill('Blue Top');
        await page.locator('#submit_search').click();

        await expect(
            page.getByRole('heading', { name: /searched products/i }),
        ).toBeVisible();

        const searchResults = page.locator(
            '.features_items .product-image-wrapper',
        );

        await expect(searchResults.first()).toBeVisible();

        await expect(
            page.getByText('Blue Top', { exact: true }).first(),
        ).toBeVisible();

        console.log('Product search passed');
        await page.waitForTimeout(5000);

        // Step 4: Add the first search result to cart
        const firstProduct = searchResults.first();

        await firstProduct.scrollIntoViewIfNeeded();
        await firstProduct.hover();

        const addToCart = firstProduct.locator('a.add-to-cart').first();

        await expect(addToCart).toBeVisible();
        await addToCart.click();

        // Step 5: Verify the cart confirmation modal
        const cartModal = page.locator('#cartModal');

        await expect(cartModal).toBeVisible();

        await expect(
            cartModal.getByText(/added!/i),
        ).toBeVisible();

        console.log('Add-to-cart confirmation passed');
        await page.waitForTimeout(3000);

        // Step 6: Open cart from the confirmation modal
        await cartModal.getByRole('link', {
            name: /view cart/i,
        }).click();

        await expect(page).toHaveURL(/view_cart/);

        const cartRows = page.locator(
            '#cart_info_table tbody tr[id^="product-"]',
        );

        await expect(cartRows.first()).toBeVisible();

        const cartCount = await cartRows.count();
        expect(cartCount).toBeGreaterThan(0);

        console.log(`Cart validation passed: ${cartCount} item(s)`);
        await page.waitForTimeout(5000);

        // Step 7: Open login page without submitting credentials
        await page.goto('https://www.automationexercise.com/login', {
            waitUntil: 'domcontentloaded',
            timeout: 45_000,
        });

        await expect(
            page.getByText('Login to your account', { exact: true }),
        ).toBeVisible();

        await expect(
            page.locator('input[data-qa="login-email"]'),
        ).toBeVisible();

        await expect(
            page.locator('input[data-qa="login-password"]'),
        ).toBeVisible();

        console.log('Login form validation passed');
        await page.waitForTimeout(5000);

        // Step 8: Verify the home page
        await page.goto('https://www.automationexercise.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 45_000,
        });

        await expect(
            page.locator('.features_items').first(),
        ).toBeVisible({ timeout: 20_000 });

        console.log('Homepage validation passed');

        // Step 9: Guarantee a minimum of 120 seconds on successful runs
        const elapsed = Date.now() - startTime;

        if (elapsed < minimumDuration) {
            await page.waitForTimeout(minimumDuration - elapsed);
        }

        const totalSeconds = (Date.now() - startTime) / 1000;

        expect(totalSeconds).toBeGreaterThanOrEqual(120);

        console.log(
            `TEST PASSED in ${totalSeconds.toFixed(1)} seconds`,
        );
    } catch (error) {
        // Save evidence if a step fails
        await page.screenshot({
            path: 'automation-exercise-failure.png',
            fullPage: true,
        }).catch(() => { });

        console.error('Test failed. Screenshot saved if possible.');
        throw error;
    }
});