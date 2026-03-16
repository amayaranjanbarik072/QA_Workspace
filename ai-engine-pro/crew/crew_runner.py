# ══════════════════════════════════════════════════════════
#  Crew Runner — entry point called by run.ts
# ══════════════════════════════════════════════════════════

import sys, json, os, re
from pathlib import Path
from crewai import Crew, Process
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

from agents import analyst, coder, runner, reporter
from tasks  import build_tasks


def run(prompt: str, project: str, dom: str,
        page_obj_path: str, spec_path: str, report_path: str):

    print(f"\n{'═'*55}")
    print(f"  🤖 CrewAI starting...")
    print(f"  📋 Prompt : {prompt[:70]}...")
    print(f"  📁 Project: {project}")
    print(f"{'═'*55}\n")

    tasks = build_tasks(
        prompt=prompt, dom=dom, project=project,
        page_obj_path=page_obj_path,
        spec_path=spec_path,
        report_path=report_path
    )

    crew = Crew(
        agents=[analyst, coder, runner, reporter],
        tasks=tasks,
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()

    # ── Auto-fix common import path mistake ─────────────────
    if os.path.exists(spec_path):
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
            print("🔧 Auto-fixed import path: ../pages → ../../pages")

    print(f"\n{'═'*55}")
    print(f"  ✅ Crew completed!")
    print(f"{'═'*55}\n")
    return result


# ── Entry point ──────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python crew_runner.py <input.json>")
        sys.exit(1)

    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))

    # Validate required fields
    required = ["prompt", "projectPath", "domContext", "pageObjPath", "specPath", "reportPath"]
    missing  = [k for k in required if not data.get(k)]
    if missing:
        print(f"❌ Missing fields in input JSON: {missing}")
        sys.exit(1)

    print(f"📥 Input OK — prompt: {data['prompt'][:60]}...")

    run(
        prompt       = data["prompt"],
        project      = data["projectPath"],
        dom          = data["domContext"],
        page_obj_path= data["pageObjPath"],
        spec_path    = data["specPath"],
        report_path  = data["reportPath"],
    )
