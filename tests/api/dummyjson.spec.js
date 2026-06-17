/**
 * DummyJSON API Tests — using ApiClient pattern
 * 
 * Demonstrates production-grade API testing patterns:
 * - Custom ApiClient class encapsulating all HTTP logic (see api-clients/DummyJsonClient.js)
 * - Shared authenticated context across tests via beforeAll hook
 * - Long-lived APIRequestContext (newContext + dispose) to survive across tests
 * - Clean test bodies focused only on assertions, not HTTP plumbing
 * 
 * What's tested:
 * - Product listing endpoint returns expected count
 * - Search endpoint correctly filters by keyword
 * - Authenticated user info accessible with stored token
 */

import { test, expect, request as playwrightRequest } from '@playwright/test';
const DummyJsonClient = require('../../api-clients/DummyJsonClient');

test.describe('DummyJSON API Suite', () => {

    let api;
    let apiContext;

    test.beforeAll(async () => {
        // Create a long-lived APIRequestContext so we can share it across tests
        apiContext = await playwrightRequest.newContext();

        // Instantiate the client and authenticate once for all tests
        api = new DummyJsonClient(apiContext);
        await api.login('emilys', 'emilyspass');
    });

    test.afterAll(async () => {
        // Always dispose contexts we created manually
        await apiContext.dispose();
    });

    test('GET /products returns at least 194 items', async () => {
        const { status, body } = await api.getProducts();

        expect(status).toBe(200);
        expect(body.total).toBeGreaterThanOrEqual(194);
    });

    test('Search returns products containing "phone"', async () => {
        const { status, body } = await api.searchProducts('phone');

        expect(status).toBe(200);

        body.products.forEach(product => {
            const allText = (product.title + product.description + product.category).toLowerCase();
            expect(allText).toContain('phone');
        });
    });

    test('Authenticated user can access /auth/me', async () => {
        const { status, body } = await api.getCurrentUser();

        expect(status).toBe(200);
        expect(body.username).toBe('emilys');
        expect(body.email).toContain('@');
    });

});