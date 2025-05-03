import { test } from '@playwright/test';
import { LoginPage } from './login-page';

// test data 
const validUsername = 'standard_user'; 
const validPassword = 'secret_sauce';
const lockedUsername = 'error_user';
const invalidPassword = 'test';

// test setup
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();
}) 

// login with standard user account 
test('test login | standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(validUsername,validPassword);
  await loginPage.checkedLoggedIn();

});

// login with locked user account 
test('test login | locked user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(lockedUsername,invalidPassword);
  });