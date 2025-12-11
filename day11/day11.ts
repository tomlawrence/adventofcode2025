import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day11.txt"));

const p1Start = performance.now();
const connections: Record<string, string[]> = {};
for (const line of lines) {
  const [device, outputs] = line.split(": ");
  connections[device] = outputs.split(" ");
}

function countOuts(key: string): number {
  let count = 0;
  for (const output of connections[key]) {
    if (output === "out") count++;
    else count += countOuts(output);
  }
  return count;
}
const part1 = countOuts("you");
const p1End = performance.now();

console.log(`Part 1 Total Paths From 'you' to 'out': ${part1}`);
logExecutionTimes({ start: p1Start, end: p1End });
