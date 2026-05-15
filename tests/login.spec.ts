import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';

type State = 'loggedIn' | 'lockedUser' | 'unknownUser';

const loginCases: { username: string; password: string; expectedOutcome: State }[] = [
  { username: 'standard_user',   password: 'secret_sauce', expectedOutcome: 'loggedIn' },
  { username: 'locked_out_user', password: 'secret_sauce', expectedOutcome: 'lockedUser' },
  { username: 'test_user',       password: 'test_password', expectedOutcome: 'unknownUser' },
];


// loop through the test cases and execute the login test for each set of credentials
for (const tc of loginCases) {
  test(`Login test for ${tc.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login(tc.username, tc.password);
    // assert the expected outcome of logged in state 
    await loginPage.assertOutcome(tc.expectedOutcome);
  });
}


