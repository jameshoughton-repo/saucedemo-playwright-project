import { test, expect } from '@playwright/test';

test('items should be sorted by price: low to high', async ({ page }) => {
  // Step 1: Go to the login page
  await page.goto('https://www.saucedemo.com/');
  
  // Step 2: Log in as the standard user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Step 3: Select the sort option "Price (low to high)"
  await page.selectOption('.product_sort_container', 'lohi');

  // Step 4: Grab all item prices after sorting
  const prices = await page.$$eval('.inventory_item_price', elements =>
    elements.map(el => parseFloat(el.textContent.replace('$', '')))
  );

  // Step 5: Verify prices are sorted in ascending order
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});


test('add product to cart', async ({ page }) => {
  // Step 1: Go to the login page
  await page.goto('https://www.saucedemo.com/');
  
  // Step 2: Log in as the standard user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Step 3: Add product to the cart 
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Step 4: Confirm the product has been added
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText('1');
});

