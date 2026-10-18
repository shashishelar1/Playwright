import { test, expect, chromium } from "@playwright/test"

test("Open the Application", async ({ }) => {

    // Launch the Browser
    const browser = await chromium.launch({ channel: 'msedge' })
    // Create a new browser context
    const context = await browser.newContext()
    // Open a new Page
    const page = await context.newPage()

    await page.goto("https://google.co.in")

    // Close the Browser
    await page.close()
})