/**
 * DummyJsonClient — API Client for https://dummyjson.com
 * 
 * Encapsulates all HTTP logic for the DummyJSON API. Tests use this class
 * to interact with the API without managing URLs, headers, or tokens directly.
 * 
 * Why this pattern (similar to Page Object Model for UI):
 * - DRY: base URL, headers, and auth defined in one place
 * - Token lifecycle managed internally (login() stores it; other methods use it)
 * - Test code stays focused on assertions, not HTTP plumbing
 * - When the API changes, only this file needs updates
 * 
 * Usage:
 *   import { request } from '@playwright/test';
 *   const ctx = await request.newContext();
 *   const api = new DummyJsonClient(ctx);
 *   await api.login('emilys', 'emilyspass');
 *   const { status, body } = await api.getProducts();
 */
class DummyJsonClient {

    /**
     * @param {APIRequestContext} requestContext - Playwright's API request context
     *   (typically created via request.newContext() in a beforeAll hook)
     */
    constructor(requestContext) {
        this.request = requestContext;
        this.baseUrl = 'https://dummyjson.com';
        this.token = null;
    }

    /**
     * Authenticate and store the access token internally.
     * Subsequent authenticated methods (e.g. getCurrentUser) will use this token automatically.
     */
    async login(username, password) {
        const response = await this.request.post(`${this.baseUrl}/auth/login`, {
            data: { username, password }
        });

        if (response.status() !== 200) {
            throw new Error(`Login failed with status ${response.status()}`);
        }

        const body = await response.json();
        this.token = body.accessToken;
        return body;
    }

    /**
     * Fetch the list of all products.
     * Returns: { status, body } where body contains products[], total, skip, limit.
     */
    async getProducts() {
        const response = await this.request.get(`${this.baseUrl}/products`);
        return { status: response.status(), body: await response.json() };
    }

    /**
     * Search products by query string.
     * Example: searchProducts('phone') returns all products matching 'phone'.
     */
    async searchProducts(query) {
        const response = await this.request.get(`${this.baseUrl}/products/search?q=${query}`);
        return { status: response.status(), body: await response.json() };
    }

    /**
     * Fetch the currently authenticated user.
     * Requires login() to have been called first; throws otherwise.
     */
    async getCurrentUser() {
        if (!this.token) {
            throw new Error('No token found. Call login() first.');
        }
        const response = await this.request.get(`${this.baseUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return { status: response.status(), body: await response.json() };
    }

}

module.exports = DummyJsonClient;