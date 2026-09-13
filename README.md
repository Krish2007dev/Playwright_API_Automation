# Playwright API Automation Framework

An API-first test automation framework built with Playwright Test and TypeScript. It combines a fluent request handler, automatic authentication, response logging, JSON schema validation, and reusable request data for reliable REST API testing.

## What is included

- Playwright API tests with a dedicated `api-testing` project
- Optional Chromium UI test project
- Worker-scoped authentication token fixture
- Fluent request builder for GET, POST, PUT, and DELETE calls
- AJV response validation with generated schemas from Genson
- Request and response logging for easier diagnosis
- HAR processing utilities and generated response schemas
- Faker-powered test data generation

## First-time setup

Follow these steps when you use the project for the first time.

### 1. Install the requirements

Install [Node.js 18 or newer](https://nodejs.org/). npm is included with Node.js. You also need an account that can access the Conduit API.

Check that Node.js and npm are available:

```bash
node --version
npm --version
```

### 2. Download the project

Clone the final automation branch and move into its folder:

```bash
git clone -b final-automation-framework-api-testing https://github.com/Krish2007dev/Playwright_API_Automation.git
cd Playwright_API_Automation
```

### 3. Install the project packages

Run these commands once:

```bash
npm install
npx playwright install
```

The first command installs the project libraries. The second command installs the browsers used by Playwright UI tests.

### Quick start

After creating `.env`, a new user can run the complete setup and API test flow with:

```bash
git clone -b final-automation-framework-api-testing https://github.com/Krish2007dev/Playwright_API_Automation.git
cd Playwright_API_Automation
npm install
npx playwright install
npx playwright test --project=api-testing
```

### 4. Add your login details

Create a file named `.env` in the project root. Add your own credentials:

```dotenv
TEST_ENV=prod
PROD_USERNAME=your-email@example.com
PROD_PASSWORD=your-password
```

The tests use these values to log in and create an API token. Never commit `.env`, passwords, API tokens, or raw HAR files containing authorization headers.

### 5. Run your first API test

Run the API test project:

```bash
npx playwright test --project=api-testing
```

You should see the test names and pass/fail results in the terminal. Playwright also creates an HTML report after the run.

Open the report with:

```bash
npx playwright show-report
```

### 6. Run one test while developing

When working on a specific test, run only that file:

```bash
npx playwright test tests/api-tests/harFlow.spec.ts
```

This gives faster feedback than running the complete suite.

## Running tests

Run all configured projects:

```bash
npx playwright test
```

Run API tests only:

```bash
npx playwright test --project=api-testing
```

Run UI tests only:

```bash
npx playwright test --project=ui-tests
```

Run one test file or open the HTML report:

```bash
npx playwright test tests/api-tests/harFlow.spec.ts
npx playwright show-report
```

Failed tests retain a Playwright trace for debugging.

## How to add a new API test

1. Create a `.spec.ts` file in `tests/api-tests/`.
2. Import `test` from `../../utils/fixtures` and `expect` from `../../utils/custom-expect`.
3. Use the `api` fixture to build the request.
4. Check the expected HTTP status in `getRequest()`, `postRequest()`, `putRequest()`, or `deleteRequest()`.
5. Validate every response with the matching schema.
6. Run the new file by itself, then run the full API project.

For POST and PUT requests, keep reusable payloads in `request-objects/`. For example, a new article payload belongs in a file such as `request-objects/POST-article.json`.

## Example API flow

The shared `api` fixture handles the base URL, authentication, logging, and status-code checks:

```typescript
import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';

test('Create an article', async ({ api }) => {
    const response = await api
        .path('/articles/')
        .body({
            article: {
                title: 'Automated article',
                description: 'Created by Playwright',
                body: 'Test content',
                tagList: []
            }
        })
        .postRequest(201);

    await expect(response).shouldMatchSchema('articles', 'POST_articles');
});
```

Available request methods include `.getRequest(status)`, `.postRequest(status)`, `.putRequest(status)`, and `.deleteRequest(status)`. Use `.params()`, `.headers()`, `.url()`, and `.clearAuth()` to customize a request.

## Schema validation

Schemas live under `response-schemas/` and are checked with the custom matcher:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles');
```

To generate or refresh a schema from a response, pass `true` as the third argument:

```typescript
await expect(response).shouldMatchSchema(
    'articles',
    'POST_articles',
    true
);
```

Review generated schema changes before committing them.

## Project structure

```text
helpers/          Authentication helpers
request-objects/  Reusable POST and PUT payloads
response-schemas/ JSON response schemas
tests/api-tests/  API test suites
tests/ui-tests/   UI test suites
utils/            Fixtures, request handler, logging, and matchers
filtered-har.json Sanitized HAR-derived test data
har-converter.js  HAR conversion utility
```

## HAR workflow

HAR files can be converted into focused request data with `har-converter.js`. Use sanitized HAR data for source control. The raw `networking.har` capture may contain credentials or session information and should remain local unless it has been scrubbed and reviewed.

## CI notes

Configure `PROD_USERNAME` and `PROD_PASSWORD` as protected CI secrets. Install dependencies and browsers before running `npx playwright test --project=api-testing`. Store the generated Playwright report as a CI artifact when a run completes.