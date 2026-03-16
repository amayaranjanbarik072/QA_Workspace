# GetApcs Automation Framework

This is a multi-app automation framework for GetApcs applications using Playwright and TypeScript.

## Structure

- **core/**: Framework engine layer (base classes, fixtures, utilities, constants, components)
- **apps/**: Business layer containing individual app configurations
- **shared-testdata/**: Cross-app shared test data (users, roles, environments)

## Apps

- vsole
- demo-keus
- demo-trass
- whms
- avision
- storesBuddy

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment: Copy `.env.example` to `.env`
3. Run tests: `npm test`
4. View report: Open `test-results/html/index.html`

## Commands

- `npm test` - Run all tests
- `npm run test:ui` - Run tests with UI
- `npm run test:debug` - Run tests in debug mode
- `npm run test:headed` - Run tests in headed mode