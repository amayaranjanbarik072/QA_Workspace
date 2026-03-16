# ══════════════════════════════════════════════════════════
#  CrewAI Tasks
# ══════════════════════════════════════════════════════════

from crewai import Task
from agents import analyst, coder, runner, reporter


def build_tasks(prompt: str, dom: str, project: str, page_obj_path: str, spec_path: str, report_path: str):

    # ── Task 1: Analyse ──────────────────────────────────────
    t1 = Task(
        description=f"""
        Analyse this instruction and return a JSON array of test steps.
        Each step must have: step, action, target, value.

        Instruction:
        {prompt}

        Return ONLY a valid JSON array. No markdown, no explanation.
        """,
        agent=analyst,
        expected_output="JSON array of test steps"
    )

    # ── Task 2: Generate Code ────────────────────────────────
    t2 = Task(
        description=f"""
        Using the test steps from Task 1 and this DOM context:
        {dom}

        Write TWO files using the write_file tool:

        FILE 1 — Page Object
        Path: {page_obj_path}
        - TypeScript class with all locators and methods
        - Use these safe locator patterns:
            Login:      page.locator('input[type="email"]')
                        page.locator('input[type="password"]')
                        page.locator('select').first()
                        page.locator('button:has-text("Sign In")')
            Navigation: page.locator('a:has-text("Engineering")')
            Tabs:       page.locator('text=General Description')
            Fields:     page.locator('input').nth(0)
            Buttons:    page.locator('button:has-text("Save")')
        - Every navigation method must call: await page.waitForLoadState('networkidle')
        - Add timeout: {{ timeout: 15000 }} to every locator action

        FILE 2 — Test Spec
        Path: {spec_path}
        ⚠️  IMPORT RULE: spec is in tests/generated/ — pages/ is TWO levels up
            CORRECT: import {{ ... }} from '../../pages/ItemMasterCreate.page'
            WRONG:   import {{ ... }} from '../pages/ItemMasterCreate.page'
        - test.setTimeout(120000) inside each test
        - Use test.beforeEach for login
        - One describe block, one test per feature

        Write FILE 1 first, then FILE 2.
        """,
        agent=coder,
        expected_output="Two TypeScript files written to disk"
    )

    # ── Task 3: Run Tests ────────────────────────────────────
    t3 = Task(
        description=f"""
        Run the Playwright tests using the run_tests tool.
        Project path: {project}
        Return the complete test output.
        """,
        agent=runner,
        expected_output="Playwright test results JSON"
    )

    # ── Task 4: Report ───────────────────────────────────────
    t4 = Task(
        description=f"""
        Write a QA report to: {report_path}

        Include:
        | Section | Details |
        |---------|---------|
        | Summary | Total / Passed / Failed / Skipped |
        | Test Cases | Each test with status and actions |
        | Failures | Root cause for each failure |
        | Recommendations | How to fix each failure |

        Use the write_file tool to save the report.
        """,
        agent=reporter,
        expected_output="Markdown report written to disk"
    )

    return [t1, t2, t3, t4]
