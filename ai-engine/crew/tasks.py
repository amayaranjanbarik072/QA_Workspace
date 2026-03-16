from crewai import Task
from agents import (
    analyst_agent,
    code_agent,
    runner_agent,
    reporter_agent
)

def create_tasks(user_prompt: str, dom_context: str, project_path: str):

    # Normalize path separators for consistency
    project_path = project_path.replace("\\\\", "/")

    page_object_path = f"{project_path}/pages/generated.page.ts"
    spec_file_path   = f"{project_path}/tests/generated/generated.spec.ts"

    # Task 1 - Analyze
    analyze_task = Task(
        description=f"""
        Analyze this user instruction: "{user_prompt}"

        Break it into clear test steps as a JSON array with:
        - step number
        - action (login/navigate/click/fill/create/validate)
        - target (what element or page)
        - value (any input value needed)

        Return ONLY a valid JSON array. No explanation, no markdown, just the JSON array.
        """,
        agent=analyst_agent,
        expected_output="A JSON array of test steps"
    )

    # Task 2 - Generate Code
    generate_task = Task(
        description=f"""
        Using the test steps from the previous task and this DOM context:
        {dom_context}

        Generate TWO TypeScript files and write them using the write_file tool.

        ════════════════════════════════════════
        FILE 1 — Page Object Model
        ════════════════════════════════════════
        file_path: {page_object_path}

        - Export a TypeScript class with all locators and methods
        - Use Playwright locators based on the DOM context provided
        - Include login(), navigate(), fill(), click(), validate() methods as needed

        ════════════════════════════════════════
        FILE 2 — Test Spec File
        ════════════════════════════════════════
        file_path: {spec_file_path}

        ⚠️  CRITICAL IMPORT PATH RULE — READ CAREFULLY:
        The spec file lives at:   tests/generated/generated.spec.ts
        The page object lives at: pages/generated.page.ts

        To go from tests/generated/ up to the project root needs TWO levels: ../../
        So the import MUST be exactly:
            import {{ GeneratedPage }} from '../../pages/generated.page';

        NEVER use:  '../pages/generated.page'   ← THIS IS WRONG, only goes up ONE level
        ALWAYS use: '../../pages/generated.page' ← THIS IS CORRECT, goes up TWO levels

        - One test per action group
        - Use test.beforeEach to handle login
        - Add proper expect() assertions

        Write FILE 1 first, then FILE 2. Use the write_file tool for each.
        """,
        agent=code_agent,
        expected_output="Two TypeScript files written to disk at the correct paths"
    )

    # Task 3 - Run Tests
    run_task = Task(
        description=f"""
        Run the Playwright tests in this project folder: {project_path}

        Use the run_playwright_tests tool with this exact project_path: {project_path}
        Return the complete test results output including pass/fail status.
        """,
        agent=runner_agent,
        expected_output="Full Playwright test execution results"
    )

    # Task 4 - Report
    report_task = Task(
        description=f"""
        Based on the test results from the previous task, generate a detailed QA report.

        Write the report to this exact file path: {project_path}/resources/reports/report.md

        Include ALL of the following sections:
        - Summary table: Total / Passed / Failed / Skipped count
        - Details of each test case with status
        - Actions that were performed in each test
        - Root cause for any failures
        - Specific recommendations to fix failures

        Use the write_file tool to save the report.
        """,
        agent=reporter_agent,
        expected_output="A markdown report file written to disk"
    )

    return [analyze_task, generate_task, run_task, report_task]