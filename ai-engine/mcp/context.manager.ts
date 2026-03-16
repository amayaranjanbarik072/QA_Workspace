import { PageContext } from "./dom.capture";
import * as fs from "fs";
import * as path from "path";

export function saveContext(projectName: string, context: PageContext): void {
  const dir = path.join(
    __dirname,
    `../../${projectName}/resources/schemas`
  );

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `${context.title.replace(/\s+/g, "-").toLowerCase()}.schema.json`;
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(context, null, 2));
  console.log(`💾 Schema saved: ${filePath}`);
}

export function formatContextForAI(context: PageContext): string {
  return `
Page URL: ${context.url}
Page Title: ${context.title}

Form Fields (${context.fields.length}):
${context.fields
  .map(
    (f) =>
      `- ${f.label || f.name || f.id} | type: ${f.type} | required: ${f.required}`
  )
  .join("\n")}

Buttons: ${context.buttons.join(", ")}
Navigation: ${context.navigation.join(", ")}
  `;
}