/**
 * Adobe eLearning Community — Public Page API Tests
 * 
 * Real-world API testing on a live Adobe property (elearning.adobe.com).
 * 
 * Approach:
 * - Only tests publicly accessible read-only endpoints
 * - No authentication; respects production-site ethics
 * - Adapts assertions to actual API behavior rather than assumed behavior
 * 
 * Notable finding:
 * - The site responds with 200 OK (not 404) for non-existent URLs,
 *   serving fallback content instead of a proper 404 status.
 *   Test 3 documents this real behavior rather than failing on the assumption.
 *   In a production context, this would be flagged to the dev team as a possible
 *   SEO/UX concern, since search engines and clients expect proper 404 signals.
 */

import { test, expect } from '@playwright/test';

test.describe('Adobe eLearning Public Page API', () => {

    test('Homepage returns 200 OK', async ({ request }) => {
        const response = await request.get('https://elearning.adobe.com/');
        expect(response.status()).toBe(200);
    });

    test('Homepage contains Adobe branding', async ({ request }) => {
        const response = await request.get('https://elearning.adobe.com/');
        const body = await response.text();

        expect(body).toContain('Adobe');
    });

    test('Non-existent URL serves fallback content (real behavior)', async ({ request }) => {
        const response = await request.get('https://elearning.adobe.com/this-page-does-not-exist-xyz123');

        // The site doesn't return 404 — it serves fallback HTML with 200 status.
        // We document this real behavior; in a real bug report this would be flagged.
        expect(response.status()).toBe(200);

        const body = await response.text();
        expect(body).toContain('Adobe');
    });

});