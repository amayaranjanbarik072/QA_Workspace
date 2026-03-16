# Demo-Trass Automation Tests

This is the test automation suite for the Demo-Trass application using Playwright and TypeScript.

## Project Structure

```
demo-trass/
├── pages/
│   ├── DemoTrassBasePage.ts      # Base page with common methods
│   ├── LoginPage.ts               # Login page object
│   └── DashboardPage.ts           # Dashboard page object
│
├── tests/
│   ├── fixture.ts                 # Playwright fixtures
│   ├── LoginTest.spec.ts          # Login test cases
│   └── DashboardTest.spec.ts      # Dashboard test cases
│
├── utils/
│   ├── DateUtil.ts               # Date utility functions
│   ├── ToastUtils.ts             # Toast notification utilities
│   ├── TablePage.ts              # Table interaction utilities
│   ├── PermissionValidator.ts    # Permission validation
│   └── envUtils.ts               # Environment configuration
│
├── config/
│   ├── env.config.ts             # Environment configurations (QA, UAT, Prod)
│   └── Credentials.ts            # Test user credentials
│
└── testdata/
    └── demo-trass.testdata.json  # Test data
```

## Setup

1. All dependencies are managed at the root level of _GetApcs
2. Run `npm install` from the root directory

## Running Tests

```bash
# Run all tests in _GetApcs framework
npm test

# Run only demo-trass tests
npx playwright test apps/demo-trass

# Run with UI
npm run test:ui

# Debug mode
npm run test:debug

# Headed mode
npm run test:headed
```

## Environment Variables

Set `TEST_ENV` to switch environments:
- `qa` (default)
- `uat`
- `prod`

```bash
TEST_ENV=uat npm test
```

## Page Objects

### LoginPage
- `login(username, password, unit)` - Login with credentials
- `loginWithCredentials(key)` - Login using predefined credentials
- `validLogin()` - Login with demo user
- `invalidLogin()` - Test invalid login

### DashboardPage
- `isDashboardVisible()` - Check if dashboard is visible
- `navigateToOrgConfig()` - Navigate to Org Config
- `navigateToEngineering()` - Navigate to Engineering
- `navigateToSalesAndMarketing()` - Navigate to Sales & Marketing
- `navigateToProcurement()` - Navigate to Procurement
- `signOut()` - Sign out from application

## Utilities

### DateUtil
- `getFormattedDate(offset)` - Get date in YYYY-MM-DD format
- `selectDate(dateField, targetDate)` - Select date in date picker
- `getFormattedDateDisplay(offset)` - Get date in DD/MM/YYYY format

### ToastUtils
- `getToastMessage(page, timeout)` - Get toast message text
- `verifyToastMessage(page, expectedText)` - Verify toast contains text
- `waitForToastDisappear(page, timeout)` - Wait for toast to disappear

### TablePage
- `getAllRows(tableLocator)` - Get all table rows
- `getRowCount(tableLocator)` - Get row count
- `getCellValue(tableLocator, rowIndex, cellIndex)` - Get cell value
- `clickRow(tableLocator, rowIndex)` - Click table row
- `searchInTable(searchFieldLocator, keyword)` - Search in table

### PermissionValidator
- `validatePermission(userPermissions, requiredPermission)` - Check single permission
- `validateMultiplePermissions(userPermissions, requiredPermissions)` - Check multiple permissions
- `hasAnyPermission(userPermissions, requiredPermissions)` - Check if has any permission

## Credentials

Test credentials are defined in `config/Credentials.ts`:
- `demoTras` - Demo user (Bangalore)
- `manager` - Manager user (Delhi)
- `admin` - Admin user (Mumbai)

## Test Data

Test data is stored in `testdata/demo-trass.testdata.json` with sample users, organizations, and configurations.

## Reports

After test execution:
- HTML Report: `playwright-report/`
- JSON Report: `test-results/results.json`
- Test Results: `test-results/`