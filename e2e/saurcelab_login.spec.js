// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');


});

// Test suite for inventory sorting on Sauce Demo
test.describe('Inventory Sort Order Test A-Z', () => {

    // Test case for sorting items in descending order (Z-A) by name
    test('should display items sorted in Z-A order', async ({ page }) => {

        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        // Step 4: Select "Name (Z to A)" from the sort dropdown
        await page.selectOption('[data-test="product-sort-container"]', 'za');

        // Step 5: Get all item names displayed on the page
        const itemNames = await page.$$eval('.inventory_item_name', (elements) =>
            elements.map((el) => el.textContent?.trim() || "") // Fallback to an empty string if textContent is null
        );

        console.log("Log start product ");

        console.log(itemNames);

        console.log("Log end  product ");



        // Step 6: Verify the items are sorted in descending order (Z-A)
        const sortedNames = [...itemNames].sort().reverse(); // Sort in descending order (Z-A)
        expect(itemNames).toEqual(sortedNames); // Assert the names are in Z-A order
    });
});




// Test suite for verifying inventory price sorting on Sauce Demo
test.describe('Inventory Price Sort Order Test High to Low', () => {

    // Test case for sorting items by price (high to low)
    test('should display items sorted by price from high to low', async ({ page }) => {


        // Step 3: Ensure we are on the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        // Step 4: Select "Price (high to low)" from the sort dropdown
        await page.selectOption('[data-test="product-sort-container"]', 'hilo');

        // Step 5: Get all item prices displayed on the page
        const itemPrices = await page.$$eval('.inventory_item_price', elements =>
            elements
                .map(el => parseFloat(el.textContent?.replace('$', '').trim() || '0'))
                .filter(price => !isNaN(price)) // Remove invalid (NaN) prices
        );


        console.log("high low sort ");

        console.log(itemPrices);

        // Step 6: Verify the prices are sorted in descending order (high to low)
        const sortedPrices = [...itemPrices].sort((a, b) => b - a); // Sort in descending order

        console.log("verify actual product ");

        console.log(sortedPrices);


        expect(itemPrices).toEqual(sortedPrices); // Assert the prices are in high-to-low order
    });
});
