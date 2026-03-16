export const ANALYZE_PROMPT = (userPrompt: string) => `
You are a QA automation expert. 
Analyze this user instruction and break it into clear test steps.

User Instruction: "${userPrompt}"

Return a JSON array of steps like this:
[
  { "step": 1, "action": "login", "target": "application", "value": "" },
  { "step": 2, "action": "navigate", "target": "Engineering module", "value": "" },
  { "step": 3, "action": "create", "target": "item", "value": "5" },
  { "step": 4, "action": "validate", "target": "table", "value": "5 items" }
]

Return ONLY the JSON array. No explanation. No markdown.
`;

export const GENERATE_CODE_PROMPT = (steps: string, domContext: string) => `
You are a Playwright TypeScript expert.
Generate a complete Playwright test file based on these steps and DOM context.

Steps: ${steps}
DOM Context: ${domContext}

Rules:
- Use Page Object Model pattern
- Use TypeScript
- Use async/await
- Add proper assertions
- Follow this structure:
  import { test, expect } from '@playwright/test';

Return ONLY the TypeScript code. No explanation.
`;
