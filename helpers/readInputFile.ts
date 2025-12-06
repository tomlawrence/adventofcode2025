import { readFileSync } from "fs";

export function readInputFile(filepath: string, options?: { trim?: boolean }): string[] {
  const { trim = true } = options ?? {};
  try {
    let file = readFileSync(filepath, "utf8");
    if (trim) file = file.trim();
    const lines = file.split(/\r?\n/);
    if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    return lines;
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      console.error(`❌ Input file not found: ${filepath}`);
      console.error(`   Please ensure the input file exists before running.`);
      process.exit(1);
    }
    throw err;
  }
}
