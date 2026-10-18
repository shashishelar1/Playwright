import { test, expect, chromium } from "@playwright/test"

test("Playwright Locators", async ({ page }) => {

    await page.goto("https://www.telekom.de/start")

    const acceptAllButton = page.getByRole("button", {
        name: "Accept All",
        exact: true
    });

    await expect(acceptAllButton).toBeVisible();
    await acceptAllButton.click();


    await page.waitForTimeout(10000)
})