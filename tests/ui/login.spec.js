/**
 * SauceDemo Login UI Tests
 * 
 * Validates login behavior on saucedemo.com — a public demo e-commerce site.
 * 
 * Why these tests exist:
 * - Login is the entry point. If it breaks, nothing else can be tested.
 * - Covers positive (valid login) and negative (wrong password, locked user) scenarios.
 * 
 * Why UI testing for login:
 * - Login IS the feature being tested here. UI-level testing is appropriate.
 * - For tests where login is only setup (like cart.spec.js), see the hybrid cookie pattern instead.
 */

const { test, expect } = require('@playwright/test');

test.describe('SauceDemo Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('valid user can log in', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('invalid password shows error', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('wrong_password');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toContainText('do not match');
  });

  test('locked out user is blocked', async ({ page }) => {
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

});