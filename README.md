# Playwright SDET Portfolio

Automation tests built with Playwright + JavaScript as part of my journey from Manual QA to SDET.

## Tech Stack
- Playwright
- JavaScript
- GitHub Actions (CI)

## Tests Covered
- **Login flows** on saucedemo.com
  - Valid user login
  - Invalid password error handling
  - Locked-out user validation

## Run Locally
npm install
npx playwright test
npx playwright show-report

## Progress Log
- **Day 1:** Project setup, 3 login tests passing across Chromium, Firefox, WebKit. CI workflow configured.