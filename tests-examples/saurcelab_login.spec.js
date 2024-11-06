// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
});


test.describe('New Todo', () => {
    test('Login with username', async ({ page }) => {
        // create a new todo locator

        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');

    });

});

