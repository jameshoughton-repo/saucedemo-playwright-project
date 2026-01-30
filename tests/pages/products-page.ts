// e2e/pages/ProductsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('#shopping_cart_container a'); // ID -> "#"
    this.cartBadge = page.locator('.shopping_cart_badge');      // class -> "."
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  // Internal helper: tests don’t need this directly
  private slug(itemName: string): string {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Locator builders (sync)
  addButton(itemName: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${this.slug(itemName)}"]`);
  }

  removeButton(itemName: string): Locator {
    return this.page.locator(`[data-test="remove-${this.slug(itemName)}"]`);
  }

  // Action methods (async)
  async addItem(itemName: string) {
    await this.addButton(itemName).click();
    await expect(this.removeButton(itemName)).toBeVisible();
  }

  async removeItem(itemName: string) {
    await this.removeButton(itemName).click();
    await expect(this.addButton(itemName)).toBeVisible();
  }

  async openCart() {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/cart\.html$/);
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.innerText(), 10);
    }
    return 0;
  }
}