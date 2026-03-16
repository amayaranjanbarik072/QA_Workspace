# ══════════════════════════════════════════════════════════
#  CrewAI Agents — powered by OpenRouter or Gemini
# ══════════════════════════════════════════════════════════

import os, shutil, subprocess
from pathlib import Path
from crewai import Agent, LLM
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

GEMINI_KEY     = os.getenv("GEMINI_API_KEY", "")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY", "")

# ── LLM Setup ───────────────────────────────────────────────

def _build_llm() -> LLM:
    """Pick the best available LLM automatically."""

    # ── Try Gemini direct FIRST (most reliable) ──────────
    if GEMINI_KEY:
        try:
            llm = LLM(
                model="gemini/gemini-2.5-flash",
                api_key=GEMINI_KEY,
                temperature=0.1,
                timeout=60
            )
            print("   🤖 LLM: Gemini 2.5 Flash (direct)")
            return llm
        except Exception as e:
            print(f"   ⚠️  Gemini failed: {e}")

    # ── Try OpenRouter models one by one ─────────────────
    if OPENROUTER_KEY:
        for model in [
            "openrouter/deepseek/deepseek-chat-v3-0324:free",
            "openrouter/deepseek/deepseek-r1-zero:free",
            "openrouter/meta-llama/llama-3.3-70b-instruct:free",
            "openrouter/mistralai/mistral-small-3.1-24b-instruct:free",
            "openrouter/nvidia/llama-3.1-nemotron-nano-8b-v1:free",
        ]:
            try:
                llm = LLM(
                    model=model,
                    api_key=OPENROUTER_KEY,
                    base_url="https://openrouter.ai/api/v1",
                    temperature=0.1,
                    timeout=60
                )
                print(f"   🤖 LLM: {model}")
                return llm
            except Exception as e:
                print(f"   ⚠️  {model} failed: {e}")
                continue

    raise ValueError("No working LLM. Check API keys in .env")

llm = _build_llm()

# ── Tool Schemas ─────────────────────────────────────────────

class _WriteInput(BaseModel):
    file_path: str = Field(description="Full absolute path of file to write")
    content:   str = Field(description="Full file content to write")

class _RunInput(BaseModel):
    project_path: str = Field(description="Absolute path to Playwright project folder")

# ── Tools ────────────────────────────────────────────────────

class WriteFileTool(BaseTool):
    name:        str = "write_file"
    description: str = "Write content to a file. Creates directories if needed."
    args_schema: Type[BaseModel] = _WriteInput

    def _run(self, file_path: str, content: str) -> str:
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return f"✅ Written: {file_path}"
        except Exception as e:
            return f"❌ Write failed: {e}"


class RunTestsTool(BaseTool):
    name:        str = "run_tests"
    description: str = "Run Playwright tests in the given project folder."
    args_schema: Type[BaseModel] = _RunInput

    def _run(self, project_path: str) -> str:
        try:
            npx = shutil.which("npx") or r"C:\Program Files\nodejs\npx.cmd"
            result = subprocess.run(
                [npx, "playwright", "test", "--reporter=json"],
                cwd=project_path, capture_output=True,
                text=True, timeout=180, shell=True
            )
            return result.stdout or result.stderr or "No output"
        except Exception as e:
            return f"❌ Test run failed: {e}"


write_tool = WriteFileTool()
run_tool   = RunTestsTool()

# ── Agents ───────────────────────────────────────────────────

analyst = Agent(
    role="QA Analyst",
    goal="Break user instructions into clear numbered test steps",
    backstory="Senior QA analyst, 10 years experience. Returns only clean JSON arrays.",
    verbose=True, allow_delegation=False, llm=llm
)

coder = Agent(
    role="Playwright Code Generator",
    goal="Write production-quality Playwright TypeScript files using Page Object Model",
    backstory="Expert Playwright TypeScript developer. Writes clean, working POM code.",
    verbose=True, allow_delegation=False, llm=llm,
    tools=[write_tool]
)

runner = Agent(
    role="Test Runner",
    goal="Execute Playwright tests and return the full results",
    backstory="QA engineer responsible for test execution.",
    verbose=True, allow_delegation=False, llm=llm,
    tools=[run_tool]
)

reporter = Agent(
    role="QA Reporter",
    goal="Write a clear markdown report summarising test results",
    backstory="QA reporting expert. Always writes structured, actionable reports.",
    verbose=True, allow_delegation=False, llm=llm,
    tools=[write_tool]
)
