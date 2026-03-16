import sys
import json
import os
import re
from pathlib import Path
from crewai import Crew, Process
from dotenv import load_dotenv

# ── Load .env ───────────────────────────────────────────────
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from agents import (
    analyst_agent,
    code_agent,
    runner_agent,
    reporter_agent,
    call_gemini_cli
)
from tasks import create_tasks


def run_qa_crew(prompt: str, project_path: str, dom_context: str):
    print(f"\n🤖 Starting QA Crew...")
    print(f"📋 Prompt: {prompt[:80]}...")
    print(f"📁 Project: {project_path}\n")

    tasks = create_tasks(
        user_prompt=prompt,
        dom_context=dom_context,
        project_path=project_path
    )

    crew = Crew(
        agents=[analyst_agent, code_agent, runner_agent, reporter_agent],
        tasks=tasks,
        process=Process.sequential,
        verbose=True
    )

    try:
        result = crew.kickoff()
        print("\n✅ QA Crew completed!")

        # ── Auto-fix import path in spec file ──────────────
        spec_path = os.path.join(project_path, "tests", "generated", "generated.spec.ts")
        if os.path.exists(spec_path):
            with open(spec_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Fix wrong single-level import to correct double-level
            fixed = re.sub(
                r"from ['\"]\.\.\/pages\/(.*?)['\"]",
                r"from '../../pages/\1'",
                content
            )

            if fixed != content:
                with open(spec_path, "w", encoding="utf-8") as f:
                    f.write(fixed)
                print("🔧 Auto-fixed import path: ../pages/ → ../../pages/")
            else:
                print("✅ Import path already correct")

        return result

    except Exception as e:
        error_str = str(e)

        # ── Auto fallback to Gemini CLI on quota error ──
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            print("\n⚠️  API quota exhausted — switching to Gemini CLI fallback...")

            try:
                cli_prompt = f"""
You are a Playwright TypeScript expert using Page Object Model pattern.

Generate test files for this scenario:
{prompt}

DOM Context:
{dom_context}

Project path: {project_path}

CRITICAL IMPORT RULE:
The spec file is at: tests/generated/generated.spec.ts
The page object is at: pages/generated.page.ts
Import MUST use: import {{ GeneratedPage }} from '../../pages/generated.page';

Generate exactly two files separated by these exact markers:

===PAGE_OBJECT===
[full TypeScript content for {project_path}/pages/generated.page.ts]
===SPEC_FILE===
[full TypeScript content for {project_path}/tests/generated/generated.spec.ts]
"""
                cli_response = call_gemini_cli(cli_prompt)

                if "===PAGE_OBJECT===" in cli_response and "===SPEC_FILE===" in cli_response:
                    parts = cli_response.split("===SPEC_FILE===")
                    page_obj_code = parts[0].replace("===PAGE_OBJECT===", "").strip()
                    spec_code = parts[1].strip()
                else:
                    page_obj_code = "import { Page } from '@playwright/test';\nexport class GeneratedPage {\n  constructor(public page: Page) {}\n}"
                    spec_code = cli_response.strip()

                # Write page object
                page_obj_path = os.path.join(project_path, "pages", "generated.page.ts")
                os.makedirs(os.path.dirname(page_obj_path), exist_ok=True)
                with open(page_obj_path, "w", encoding="utf-8") as f:
                    f.write(page_obj_code)
                print(f"✅ Page object written: {page_obj_path}")

                # Write spec file
                spec_path = os.path.join(project_path, "tests", "generated", "generated.spec.ts")
                os.makedirs(os.path.dirname(spec_path), exist_ok=True)
                with open(spec_path, "w", encoding="utf-8") as f:
                    f.write(spec_code)
                print(f"✅ Spec file written: {spec_path}")

                # ── Auto-fix import path in CLI-generated spec too ──
                with open(spec_path, "r", encoding="utf-8") as f:
                    content = f.read()
                fixed = re.sub(
                    r"from ['\"]\.\.\/pages\/(.*?)['\"]",
                    r"from '../../pages/\1'",
                    content
                )
                if fixed != content:
                    with open(spec_path, "w", encoding="utf-8") as f:
                        f.write(fixed)
                    print("🔧 Auto-fixed import path in CLI output")

                print("\n✅ Gemini CLI fallback completed!")
                return "Files generated via Gemini CLI fallback"

            except Exception as cli_error:
                print(f"❌ CLI fallback also failed: {cli_error}")
                raise e

        raise e


# ── Entry point ─────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Usage: python qa.crew.py <input_json_file>")
        sys.exit(1)

    input_file = sys.argv[1]

    if not os.path.exists(input_file):
        print(f"❌ Input file not found: {input_file}")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # ── Support both old and new key names ──────────────
    prompt       = data.get("prompt")      or data.get("user_prompt", "")
    project_path = data.get("projectPath") or data.get("project_path", "")
    dom_context  = data.get("domContext")  or data.get("dom_context", "")

    # ── Debug output ────────────────────────────────────
    print(f"📥 Input received:")
    print(f"   prompt     : {prompt[:60]}..." if prompt else "   prompt     : ❌ EMPTY")
    print(f"   projectPath: {project_path}"   if project_path else "   projectPath : ❌ EMPTY")
    print(f"   domContext  : {len(dom_context)} chars")

    # ── Validate ────────────────────────────────────────
    if not prompt:
        print("\n❌ ERROR: prompt is empty!")
        print("📋 Keys found in input:", list(data.keys()))
        sys.exit(1)

    if not project_path:
        print("\n❌ ERROR: projectPath is empty!")
        print("📋 Keys found in input:", list(data.keys()))
        sys.exit(1)

    run_qa_crew(
        prompt=prompt,
        project_path=project_path,
        dom_context=dom_context
    )