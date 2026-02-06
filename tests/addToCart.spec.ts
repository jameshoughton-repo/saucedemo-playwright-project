import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { ProductsPage } from './pages/products-page';

//test data 
const validUsername = 'standard_user'; 
const validPassword = 'secret_sauce';


//test setup
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();
  //log in as the standard user
  await loginPage.login(validUsername,validPassword);
  await loginPage.checkedLoggedIn();
}) 


//Add one item to cart test
test('add product to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addItem('Sauce Labs Backpack');
    const cartCount = await productsPage.getCartCount();
    test.expect(cartCount).toBe(1);
});

//Add multiple items to cart test
test('add multiple products to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addItem('Sauce Labs Backpack');
    await productsPage.addItem('Sauce Labs Bike Light');
    const cartCount = await productsPage.getCartCount();
    test.expect(cartCount).toBe(2);
});

//Remove item from cart test
test('remove product from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addItem('Sauce Labs Backpack');
    await productsPage.removeItem('Sauce Labs Backpack');
    const cartCount = await productsPage.getCartCount();
    test.expect(cartCount).toBe(0);
});

//Sort products be price test (low to high)
test('sort products by price', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('Price (low to high)');
    // Additional assertions to verify sorting can be added here
    test.expect(await productsPage.sortDropdown().inputValue()).toBe('lohi');
});

//Sort products by name test (Z to A)
test('sort products by name', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('Name (Z to A)');
    // Additional assertions to verify sorting can be added here
    test.expect(await productsPage.sortDropdown().inputValue()).toBe('za');
});