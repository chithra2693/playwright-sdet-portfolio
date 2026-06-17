/**
 * SauceDemo End-to-End Purchase Test (Hybrid Pattern)
 * 
 * Demonstrates the API-setup + UI-test hybrid pattern.
 * 
 * The challenge:
 * - This test is named "complete a purchase" — but a pure UI version would spend
 *   5+ lines on the login form before reaching the actual purchase flow.
 * - If login form breaks, this test fails — even though the bug isn't in checkout.
 * 
 * The solution:
 * - Skip the UI login by injecting saucedemo's session cookie directly,
 *   so the test starts on the inventory page with a logged-in user.
 * - Now the test fails ONLY if the actual purchase flow breaks.
 * 
 * How we found the cookie name:
 * - Logged in normally on saucedemo.com
 * - Opened DevTools → Application → Cookies
 * - Identified the cookie 'session-username' with value 'standard_user'
 * - This is the standard SDET investigation technique for any unfamiliar auth flow.
 * 
 * Outcome:
 * - Test runs ~40% faster than the pure-UI version
 * - Test stays focused on what it's actually verifying: checkout, not login
 */

const { test, expect } = require('@playwright/test');

test('user can complete a purchase', async ({ page }) => {
  // ─── STEP 1: SKIP LOGIN VIA SESSION COOKIE ──────────────
  await page.context().addCookies([{
    name: 'session-username',
    value: 'standard_user',
    domain: 'www.saucedemo.com',
    path: '/',
  }]);

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL(/inventory/);

  // ─── STEP 2: ADD ITEM TO CART ───────────────────────────
  await page.locator('#add-to-cart-sauce-labs-backpack').click();

  // ─── STEP 3: OPEN THE CART ──────────────────────────────
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart/);

  // ─── STEP 4: VERIFY ITEM IN CART ────────────────────────
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

  // ─── STEP 5: CHECKOUT FORM ──────────────────────────────
  await page.locator('#checkout').click();
  await page.locator('#first-name').fill('Chithra');
  await page.locator('#last-name').fill('Basker');
  await page.locator('#postal-code').fill('411014');
  await page.locator('#continue').click();

  // ─── STEP 6: FINISH ORDER ───────────────────────────────
  await page.locator('#finish').click();

  // ─── STEP 7: VERIFY SUCCESS ─────────────────────────────
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});