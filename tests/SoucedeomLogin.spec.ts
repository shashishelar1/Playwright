import { test, expect, chromium } from "@playwright/test"

test("Playwright Locators", async ({ page }) => {

    await page.goto("https://www.saucedemo.com/")

    await page.waitForTimeout(10000)
})