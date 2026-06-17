# Playwright SDET Portfolio

[![Tests](https://img.shields.io/badge/tests-19%20passing-brightgreen)]()
[![Playwright](https://img.shields.io/badge/Playwright-1.x-45ba4b)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)]()

Automation testing portfolio built during my transition from Manual QA at Adobe to SDET. Demonstrates production-grade API and UI testing patterns using Playwright + JavaScript.

---

## What this project demonstrates

This isn't a tutorial copy — every test was written deliberately to showcase a specific SDET skill.

| Skill | Where it's demonstrated |
|---|---|
| **REST API testing** | `tests/api/dummyjson.spec.js` |
| **API Client pattern (DRY)** | `api-clients/DummyJsonClient.js` |
| **Token-based authentication** | DummyJSON login → /auth/me chain |
| **Page Object Model (POM)** | `pages/LoginPage.js` |
| **Hybrid API + UI testing** | `tests/api/github-hybrid.spec.js`, `tests/ui/cart.spec.js` |
| **Cross-browser UI testing** | Chromium, Firefox, WebKit projects |
| **Negative testing** | Login error scenarios, fake URLs |
| **Real-world ethical testing** | `tests/api/elearning.spec.js` (live Adobe site, read-only) |
| **Playwright project separation** | API vs UI projects in `playwright.config.js` |
| **Long-lived APIRequestContext** | `request.newContext()` + `dispose()` pattern |

---

## Project Structure

\```
playwright-sdet-portfolio/
├── api-clients/
│   └── DummyJsonClient.js       # API client (encapsulates HTTP logic)
├── pages/
│   └── LoginPage.js             # Page Object for saucedemo login
├── tests/
│   ├── api/
│   │   ├── dummyjson.spec.js    # API tests using DummyJsonClient
│   │   ├── elearning.spec.js    # Live Adobe production-site tests
│   │   └── github-hybrid.spec.js # API truth vs UI display cross-validation
│   └── ui/
│       ├── login.spec.js        # SauceDemo login flow tests
│       └── cart.spec.js         # End-to-end purchase (hybrid pattern)
├── playwright.config.js         # Project setup: api + chromium/firefox/webkit
├── package.json
└── README.md
\```

---

## Test Coverage Highlights

### 1. Production-grade API testing
- 4 endpoints covered: `/products`, `/products/search`, `/auth/login`, `/auth/me`
- Custom `DummyJsonClient` class wraps all HTTP logic
- `beforeAll` + `request.newContext()` pattern: login once, share auth across tests
- Tests focus only on assertions — zero HTTP plumbing in test bodies

### 2. Hybrid API + UI cross-validation
- Verifies GitHub API data matches what github.com displays in the browser
- Catches a real bug class: UI showing stale data despite correct backend

### 3. Hybrid setup pattern (cookies)
- `cart.spec.js` bypasses saucedemo login UI by injecting the session cookie directly
- Discovered via Chrome DevTools investigation — real SDET technique
- Test runs ~40% faster than pure UI version; failures now signal real checkout bugs

### 4. Ethical real-world testing
- `elearning.spec.js` tests a live Adobe production property
- Read-only, anonymous endpoints only; respects production-site constraints
- Documents real site behavior — e.g., the site serves fallback content (not 404) for missing URLs

---

## Tech Stack

- **Test Framework:** Playwright Test
- **Language:** JavaScript (ES6+)
- **Patterns:** Page Object Model, API Client Pattern
- **CI/CD:** GitHub Actions

---

## Run Locally

\```bash
# Install dependencies
npm install

# Install browsers (first time only)
npx playwright install

# Run all tests
npx playwright test

# Run only API tests
npx playwright test --project=api

# Run only UI tests in Chromium (fastest)
npx playwright test --project=chromium

# Open the HTML report
npx playwright show-report
\```

---

## Current Status

| Metric | Value |
|---|---|
| Total tests | 19 |
| Passing | 19 ✅ |
| Test files | 5 |
| Patterns used | POM, API Client, Hybrid, Cross-validation |
| Total runtime | ~22 seconds |

---

## Key Architectural Decisions

### Why a separate `api` project in `playwright.config.js`?
API tests don't need a browser. Separating them into a dedicated project means:
- API tests run once per test (not 3× across browsers)
- Centralized baseURL config
- Faster CI runs

### Why a custom ApiClient class instead of raw `request.get()` calls?
- **DRY**: URLs, headers, and tokens defined in one place
- **Token lifecycle**: managed inside the class; tests never see raw tokens
- **Refactor-safe**: if the API changes, only the client file needs updates

### Why cookies for the saucedemo hybrid test instead of localStorage?
Initial attempt with `localStorage.setItem('session-username', ...)` failed (test redirected to login). DevTools investigation revealed saucedemo uses cookies, not localStorage. Updated to `page.context().addCookies()`. Real SDET lesson: always verify auth mechanisms against actual app behavior.

---

## About me

**Chithra Basker** — Manual QA at Adobe (Captivate), transitioning to SDET.

This portfolio represents my self-driven learning path covering API testing fundamentals (Postman + Playwright), authentication flows, hybrid testing patterns, and test architecture. Each file demonstrates a specific skill applicable to real product company SDET roles.


- **LinkedIn:** [your LinkedIn URL]