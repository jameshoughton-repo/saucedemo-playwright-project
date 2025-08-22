import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';

// test data 
const validUsername = 'standard_user'; 
const validPassword = 'secret_sauce';


// test setup
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();
  // log in as the standard user
  await loginPage.login(validUsername,validPassword);
  await loginPage.checkedLoggedIn();
}) 

test('items should be sorted by price: low to high', async ({ page }) => {
  // step 1: Select the sort option "Price (low to high)"
  await page.selectOption('.product_sort_container', 'lohi');

  // step 2: Grab all item prices after sorting
  const prices = await page.$$eval('.inventory_item_price', elements =>
    elements.map(el => parseFloat(el.textContent.replace('$', '')))
  );

  // step 3: Verify prices are sorted in ascending order
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});


test('add product to cart', async ({ page }) => {
  // step 1: Add product to the cart 
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // step 2: Confirm the product has been added
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText('1');
});

test('remove product from the cart', async ({ page }) => {
  // step 1: Add then remove product from the cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('[data-test="remove-sauce-labs-backpack"]')

  // step 2: confirm the product has been removed
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toBeHidden();
})

