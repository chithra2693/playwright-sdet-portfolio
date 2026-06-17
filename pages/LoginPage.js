/**
 * LoginPage — Page Object Model for saucedemo.com login
 * 
 * Encapsulates the locators and actions for the saucedemo login page,
 * following the standard Page Object Model (POM) pattern.
 * 
 * Why this pattern:
 * - Locators are defined once and reused across tests
 * - Login behavior centralized in one place; updates only need to happen here
 * - Tests stay readable: loginPage.login(user, pass) tells the story
 * 
 * Usage:
 *   const { LoginPage } = require('../../pages/LoginPage');
 *   const loginPage = new LoginPage(page);
 *   await loginPage.goto();
 *   await loginPage.login('standard_user', 'secret_sauce');
 */
class LoginPage {

  /**
   * @param {Page} page - Playwright's page fixture
   */
  constructor(page) {
      this.page = page;
      this.usernameField = page.locator('#user-name');
      this.passwordField = page.locator('#password');
      this.loginButton = page.locator('#login-button');
      this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navigate to the saucedemo login page.
   */
  async goto() {
      await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Fill credentials and submit the login form.
   */
  async login(username, password) {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.loginButton.click();
  }

}

module.exports = { LoginPage };