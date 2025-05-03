import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';

// test data 
const validUsername = 'standard_user'; 
const validPassword = 'secret_sauce';
const lockedUsername = 'locked_out_user';
const invalidPassword = 'test_password';
const unknownUsername = 'test_user';

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
    await loginPage.login(lockedUsername,validPassword);
    await loginPage.checkedLockedUser();
  });

// login with unknown user account 
test('test login | unknown user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(unknownUsername,invalidPassword);
    await loginPage.checkedUnknownUser();
});