import { test, expect, chromium } from "@playwright/test"

test("Playwright Locators", async ({ page }) => {

    await page.goto("https://playwright.dev/")

    const api_link = page.getByText("API");

    console.log("Count:", await api_link.count());
    console.log("Visible:", await api_link.first().isVisible());

    await api_link.first().click();


    await page.waitForTimeout(10000)
})