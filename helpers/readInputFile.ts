import { readFileSync } from "fs";

export function readInputFile(filepath: string): string[] {
  try {
    return readFileSync(filepath, "utf8").trim().split(/\r?\n/);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      console.error(`❌ Input file not found: ${filepath}`);
      console.error(`   Please ensure the input file exists before running.`);
      process.exit(1);
    }
    throw err;
  }
}
