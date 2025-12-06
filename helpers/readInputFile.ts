import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { getSampleInput } from "./getSampleInput";

export function readInputFile(filepath: string, options?: { trim?: boolean }): string[] {
  const { trim = true } = options ?? {};
  let fileToRead = filepath;
  if (!existsSync(filepath)) {
    const dir = dirname(filepath);
    const inputTxtPath = join(dir, "input.txt");
    if (existsSync(inputTxtPath)) {
      fileToRead = inputTxtPath;
      console.log(`📝 Using input.txt instead of ${filepath.split("/").pop()}`);
    }
  }
  try {
    let file = readFileSync(fileToRead, "utf8");
    if (trim) file = file.trim();
    const lines = file.split(/\r?\n/);
    if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    return lines;
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      const dayMatch = filepath.match(/day(\d+)/i);
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[1], 10);
        console.log(
          `📝 Input file ${filepath.split("/").pop()} not found. Using sample data for day ${dayNumber}...`,
        );
        let file = getSampleInput(dayNumber);
        if (trim) file = file.trim();
        const lines = file.split(/\r?\n/);
        if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
        return lines;
      }
      console.error(`❌ Input file not found: ${filepath}`);
      console.error(`   Please ensure the input file exists before running.`);
      process.exit(1);
    }
    throw err;
  }
}
