/**
 * GitHub API + UI Cross-Validation (Hybrid Test)
 * 
 * Demonstrates the API-truth-vs-UI-display hybrid testing pattern.
 * 
 * Approach:
 * - Fetch repo metadata from the GitHub REST API (source of truth)
 * - Navigate to the same repo on github.com in a real browser
 * - Verify that the displayed UI matches what the API reports
 * 
 * Why this pattern matters:
 * - Pure API tests can't catch UI display bugs (stale cache, wrong template, etc.)
 * - Pure UI tests don't know the "truth", so can't catch when display drifts from data
 * - Hybrid tests catch this gap — common in real product bugs
 * 
 * Defensive coding:
 * - The description check is skipped when the API returns null,
 *   keeping the test robust against missing optional fields.
 */

import { test, expect } from '@playwright/test';

test.describe('GitHub API + UI Cross-Validation', () => {

    test('Repo details match between API and UI', async ({ request, page }) => {
        // ─── STEP 1: GET THE TRUTH FROM THE API ─────────────
        const response = await request.get('https://api.github.com/repos/chithra2693/playwright-sdet-portfolio');
        expect(response.status()).toBe(200);

        const body = await response.json();
        const apiName = body.name;
        const apiDescription = body.description;

        // ─── STEP 2: VERIFY THE UI MATCHES ──────────────────
        await page.goto('https://github.com/chithra2693/playwright-sdet-portfolio');

        // The page title should contain the repo name from the API
        await expect(page).toHaveTitle(new RegExp(apiName));

        // The description, if it exists, should appear somewhere on the page
        if (apiDescription) {
            await expect(page.locator('body')).toContainText(apiDescription);
        }
    });

});