import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly enterUsername: Locator;
    readonly enterPassword: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.enterUsername = page.getByPlaceholder('Username');
        this.enterPassword = page.getByPlaceholder('Password');
        this.loginButton = page.locator('[data-test="login-button"]');
        
    }

    async navigateTo() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.enterUsername.fill(username);
        await this.enterPassword.fill(password);
        await this.loginButton.click();
    }

    async checkedLoggedIn() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

    async checkedLockedUser() {
        await expect(this.page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    }

    async checkedUnknownUser() {
        await expect(this.page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    }

}