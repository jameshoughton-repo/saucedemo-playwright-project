import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';

// test data organised in an object for better maintainability
const validUser = {
    username: 'standard_user',
    password: 'secret_sauce'
};

const lockedUser = {
    username: 'locked_out_user',
    password: 'secret_sauce'
};

const unknownUser = {
    username: 'test_user',
    password: 'test_password'
};  


// test setup
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();
}) 

// login with standard user account 
test('test login | standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(validUser.username,validUser.password);
  await loginPage.checkedLoggedIn();

});

// login with locked user account 
test('test login | locked user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(lockedUser.username,lockedUser.password);
    await loginPage.checkedLockedUser();
  });

// login with unknown user account 
test('test login | unknown user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(unknownUser.username,unknownUser.password);
    await loginPage.checkedUnknownUser();
});