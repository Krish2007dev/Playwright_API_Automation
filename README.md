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

## Requirements

- Node.js 18 or newer
- npm
- Access to the Conduit API configured in `api-test.config.ts`

## Setup

Install dependencies:

```bash
npm install
npx playwright install
```

The production configuration reads credentials from environment variables. Create a local `.env` file, or set the variables in your shell:

```dotenv
TEST_ENV=prod
PROD_USERNAME=your-email@example.com
PROD_PASSWORD=your-password
```

Do not commit `.env`, API tokens, passwords, or raw HAR captures containing authorization headers.

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