// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Utility function to log in to Sauce Demo
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
async function login(page) {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('input[data-test="username"]', 'standard_user');
  await page.fill('input[data-test="password"]', 'secret_sauce');
  await page.click('input[data-test="login-button"]');
  // Wait for navigation after login
}

/**
 * Utility function to extract item names or prices
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} selector - The selector for item names or prices.
 * @param {Function} transformFn - Transformation function for the extracted text (e.g., parseFloat for prices).
 * @returns {Promise<any[]>} - The extracted and transformed data.
 */
async function extractItemData(page, selector, transformFn = (text) => text.trim()) {
  return page.$$eval(selector, (elements, transformFn) =>
    elements.map((el) => {
      const text = el.textContent?.trim(); // Safely access textContent
      return text ? transformFn(text) : ''; // Return empty string if no text content
    })
    , transformFn);
}

/**
 * Utility function to handle sorting
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} sortValue - The sort option value (e.g., 'za' or 'hilo').
 */
async function sortItems(page, sortValue) {
  await page.selectOption('[data-test="product-sort-container"]', sortValue);
  // Wait for the page to reflect the new sorting (waiting for the first item to change position)
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

// Test suite for inventory sorting on Sauce Demo
test.describe('Inventory Sort Order Test', () => {

  test('should display items sorted in Z-A order by name', async ({ page }) => {
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Sort items by Name Z-A
    await sortItems(page, 'za');

    // Extract item names and verify they are in descending order (Z-A)
    const itemNames = await extractItemData(page, '.inventory_item_name');
    const sortedNames = [...itemNames].sort().reverse(); // Z-A order

    expect(itemNames).toEqual(sortedNames); // Verify the items are sorted correctly
  });

  test('should display items sorted by price from high to low', async ({ page }) => {
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Sort items by Price High to Low
    await sortItems(page, 'hilo');

    // Extract item prices and verify they are in descending order (High to Low)
    const itemPrices = await extractItemData(page, '.inventory_item_price', (text) => parseFloat(text.replace('$', '').trim()));
    const sortedPrices = [...itemPrices].sort((a, b) => b - a); // High to Low order

    expect(itemPrices).toEqual(sortedPrices); // Verify the prices are sorted correctly
  });
});
