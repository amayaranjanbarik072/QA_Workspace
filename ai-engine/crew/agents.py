import subprocess, os, shutil
from pathlib import Path
from crewai import Agent, LLM
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

gemini_key     = os.getenv("GEMINI_API_KEY_CREW") or os.getenv("GEMINI_API_KEY", "")
openrouter_key = os.getenv("OPENROUTER_API_KEY", "")

print(f"🔑 Gemini key    : {gemini_key[:15]}..."     if gemini_key     else "⚠️  No Gemini key")
print(f"🔑 OpenRouter key: {openrouter_key[:15]}..." if openrouter_key else "⚠️  No OpenRouter key")


def make_llm() -> LLM:
    if openrouter_key:
        for model in [
            "openrouter/free",                              # ← auto-picks best free model
            "meta-llama/llama-3.3-70b-instruct:free",
            "deepseek/deepseek-chat:free",
            "mistralai/mistral-7b-instruct:free",
            "qwen/qwen-2.5-72b-instruct:free",
        ]:
            try:
                llm = LLM(
                    model=f"openrouter/{model}" if not model.startswith("openrouter/") else model,
                    api_key=openrouter_key,
                    base_url="https://openrouter.ai/api/v1",
                    temperature=0.1,
                    timeout=60
                )
                print(f"🤖 CrewAI LLM: {model}")
                return llm
            except Exception as e:
                print(f"⚠️  {model} failed: {e}")
                continue

    if gemini_key:
        llm = LLM(
            model="gemini/gemini-2.5-flash",
            api_key=gemini_key,
            temperature=0.1,
            timeout=60
        )
        print("🤖 CrewAI LLM: Gemini 2.5 Flash (direct)")
        return llm

    raise ValueError("❌ No API key found!")

def call_gemini_cli(prompt: str) -> str:
    """Fallback: call Gemini CLI directly via PowerShell"""
    clean = prompt.replace("\r\n", " ").replace("\n", " ").strip()
    result = subprocess.run(
        ["powershell.exe", "-Command", "gemini.ps1"],
        input=clean,
        capture_output=True,
        text=True,
        timeout=90,
        env={
            **os.environ,
            "PATH": f"{os.environ.get('APPDATA', '')}\\npm;{os.environ.get('PATH', '')}"
        }
    )
    if result.stdout.strip():
        return result.stdout.strip()
    raise Exception(f"Gemini CLI failed: {result.stderr}")


gemini_llm = make_llm()

# ── Tool Input Schemas ──────────────────────────────────────

class RunTestsInput(BaseModel):
    project_path: str = Field(
        description="Path to the Playwright project folder"
    )

class WriteFileInput(BaseModel):
    file_path: str = Field(
        description="Full path of the file to write"
    )
    content: str = Field(
        description="Content to write to the file"
    )

class ReadFileInput(BaseModel):
    file_path: str = Field(
        description="Full path of the file to read"
    )

# ── Tools ───────────────────────────────────────────────────

class RunPlaywrightTestsTool(BaseTool):
    name: str = "Run Playwright Tests"
    description: str = "Runs Playwright tests in the specified project folder"
    args_schema: Type[BaseModel] = RunTestsInput

    def _run(self, project_path: str) -> str:
        try:
            npx_path = shutil.which("npx")
            if not npx_path:
                possible_paths = [
                    r"C:\Program Files\nodejs\npx.cmd",
                    r"C:\Users\i072\AppData\Roaming\npm\npx.cmd",
                    r"C:\Program Files\nodejs\npx",
                ]
                for p in possible_paths:
                    if os.path.exists(p):
                        npx_path = p
                        break

            if not npx_path:
                return "Error: npx not found. Please check Node.js installation."

            print(f"🎯 Using npx: {npx_path}")

            result = subprocess.run(
                [npx_path, "playwright", "test", "--reporter=json"],
                cwd=project_path,
                capture_output=True,
                text=True,
                timeout=120,
                shell=True
            )
            return result.stdout or result.stderr or "No output"
        except Exception as e:
            return f"Error running tests: {str(e)}"


class WriteFileTool(BaseTool):
    name: str = "Write File"
    description: str = "Writes content to a file at the given path"
    args_schema: Type[BaseModel] = WriteFileInput

    def _run(self, file_path: str, content: str) -> str:
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return f"✅ File written: {file_path}"
        except Exception as e:
            return f"Error writing file: {str(e)}"


class ReadFileTool(BaseTool):
    name: str = "Read File"
    description: str = "Reads content from a file"
    args_schema: Type[BaseModel] = ReadFileInput

    def _run(self, file_path: str) -> str:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"


# ── Tool Instances ──────────────────────────────────────────

run_tests_tool  = RunPlaywrightTestsTool()
write_file_tool = WriteFileTool()
read_file_tool  = ReadFileTool()

# ── Agents ──────────────────────────────────────────────────

analyst_agent = Agent(
    role="QA Analyst",
    goal="Analyze user instructions and break them into clear actionable test steps",
    backstory="""You are a senior QA analyst with 10 years of experience.
    You excel at understanding plain English requirements and breaking them
    into precise executable test scenarios.""",
    verbose=True,
    allow_delegation=False,
    llm=gemini_llm
)

code_agent = Agent(
    role="Playwright Code Generator",
    goal="Generate clean Playwright TypeScript test code following Page Object Model pattern",
    backstory="""You are an expert Playwright TypeScript developer.
    You always follow best practices, use POM pattern,
    and write clean maintainable test code.""",
    verbose=True,
    allow_delegation=False,
    llm=gemini_llm,
    tools=[write_file_tool]
)

runner_agent = Agent(
    role="Test Runner",
    goal="Execute Playwright tests and capture results accurately",
    backstory="""You are responsible for running automated tests
    and ensuring they execute correctly.""",
    verbose=True,
    allow_delegation=False,
    llm=gemini_llm,
    tools=[run_tests_tool]
)

reporter_agent = Agent(
    role="QA Reporter",
    goal="Analyze test results and generate clear actionable reports",
    backstory="""You are a QA reporting expert who transforms raw test results
    into clear human-readable reports with insights and recommendations.""",
    verbose=True,
    allow_delegation=False,
    llm=gemini_llm,
    tools=[read_file_tool, write_file_tool]
)