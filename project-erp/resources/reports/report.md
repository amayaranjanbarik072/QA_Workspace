# QA Report - Item Master Functionality

## Summary Table

| Category | Count |
| :------- | :---- |
| Total    | 5     |
| Passed   | 0     |
| Failed   | 5     |
| Skipped  | 0     |

## Test Case Details

### Test Case 1: `should validate all tabs on Item Master Create page`
*   **Status:** Failed
*   **Actions Performed:**
    1.  Login to the application with username `amaya@mail.com`, password `amaya@123`, and unit `Bangalore`.
    2.  Navigate to the "Engineering module".
    3.  Navigate to the "Item Master Create page".
    4.  Click on "General Description tab" and validate it becomes active.
    5.  Click on "Alternates tab" and validate it becomes active.
    6.  Click on "Engineering tab" and validate it becomes active.
    7.  Click on "Dimensions tab" and validate it becomes active.
    8.  Click on "Routing tab" and validate it becomes active.
    9.  Click on "Approved Vendor List tab" and validate it becomes active.
    10. Click on "Planning tab" and validate it becomes active.
    11. Click on "Warehouse tab" and validate it becomes active.
    12. Click on "Shipping tab" and validate it becomes active.
    13. Click on "Quality tab" and validate it becomes active.
    14. Click on "Costing tab" and validate it becomes active.
*   **Root Cause for Failure:** The test execution timed out before completion. The exact point of failure within the test could not be determined.
*   **Recommendations to Fix:**
    *   Increase the timeout duration for Playwright tests if the application is slow to respond.
    *   Investigate application performance, especially during page loads and tab interactions.
    *   Review the test steps for any potential long-running operations or infinite waits.

### Test Case 2: `should create an FG Item`
*   **Status:** Failed
*   **Actions Performed:**
    1.  Login to the application with username `amaya@mail.com`, password `amaya@123`, and unit `Bangalore`.
    2.  Navigate to the "Engineering module".
    3.  Navigate to the "Item Master Create page".
    4.  Fill the "Item Name field" with "FG Item1".
    5.  Select "FG" from the "Item Type dropdown".
    6.  Click the "Save button".
    7.  Validate that a "Item saved successfully" message is visible.
*   **Root Cause for Failure:** The test execution timed out before completion. The exact point of failure within the test could not be determined.
*   **Recommendations to Fix:**
    *   Increase the timeout duration for Playwright tests.
    *   Investigate the performance of the item creation process, particularly the save operation.
    *   Ensure the success message locator is robust and appears consistently.

### Test Case 3: `should create an SA Item`
*   **Status:** Failed
*   **Actions Performed:**
    1.  Login to the application with username `amaya@mail.com`, password `amaya@123`, and unit `Bangalore`.
    2.  Navigate to the "Engineering module".
    3.  Navigate to the "Item Master Create page".
    4.  Navigate back to the "Item Master Create page".
    5.  Fill the "Item Name field" with "SA Item1".
    6.  Select "SA" from the "Item Type dropdown".
    7.  Click the "Save button".
    8.  Validate that a "Item saved successfully" message is visible.
*   **Root Cause for Failure:** The test execution timed out before completion. The exact point of failure within the test could not be determined.
*   **Recommendations to Fix:**
    *   Increase the timeout duration for Playwright tests.
    *   Investigate the performance of the item creation process for SA items.
    *   Verify the navigation back to the create page is efficient.

### Test Case 4: `should create a PP Item`
*   **Status:** Failed
*   **Actions Performed:**
    1.  Login to the application with username `amaya@mail.com`, password `amaya@123`, and unit `Bangalore`.
    2.  Navigate to the "Engineering module".
    3.  Navigate to the "Item Master Create page".
    4.  Navigate back to the "Item Master Create page".
    5.  Fill the "Item Name field" with "PP Item1".
    6.  Select "PurchasePart" from the "Item Type dropdown".
    7.  Click the "Save button".
    8.  Validate that a "Item saved successfully" message is visible.
*   **Root Cause for Failure:** The test execution timed out before completion. The exact point of failure within the test could not be determined.
*   **Recommendations to Fix:**
    *   Increase the timeout duration for Playwright tests.
    *   Investigate the performance of the item creation process for PP items.
    *   Ensure the "PurchasePart" option is correctly handled by the dropdown.

### Test Case 5: `should validate created items in the Item List`
*   **Status:** Failed
*   **Actions Performed:**
    1.  Login to the application with username `amaya@mail.com`, password `amaya@123`, and unit `Bangalore`.
    2.  Navigate to the "Engineering module".
    3.  Navigate to the "Item Master Create page".
    4.  Navigate to the "Item List page".
    5.  Validate that "FG Item1" is visible in the item list table.
    6.  Validate that "SA Item1" is visible in the item list table.
    7.  Validate that "PP Item1" is visible in the item list table.
*   **Root Cause for Failure:** The test execution timed out before completion. It's possible that the items were not created in previous steps due to the timeout, leading to this validation failure.
*   **Recommendations to Fix:**
    *   Increase the timeout duration for Playwright tests.
    *   Ensure the item creation steps (Test Cases 2, 3, 4) are stable and complete successfully before this validation test runs.
    *   Investigate the performance of the "Item List page" and the visibility of newly created items.