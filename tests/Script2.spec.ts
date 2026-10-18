import { test, expect, chromium } from "@playwright/test"

test("Playwright Locators", async ({ page }) => {

    await page.goto("https://google.com")

    const gmail_link = page.getByText("Gmail")

    await gmail_link.click()

    await page.waitForTimeout(10000)
})