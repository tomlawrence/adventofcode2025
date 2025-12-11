import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";
import { getSampleInput } from "../helpers/getSampleInput";

const lines = readInputFile(join(__dirname, "day11.txt"));

const p1Start = performance.now();

function buildConnections(lines: string[]): Record<string, string[]> {
  const connections: Record<string, string[]> = {};
  for (const line of lines) {
    const [device, outputs] = line.split(": ");
    connections[device] = outputs.split(" ");
  }
  return connections;
}
let connections: Record<string, string[]> = buildConnections(lines);

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

const p2Start = performance.now();
// Get day 11 part 2 sample if using part 1 sample
if (lines[0] === "aaa: you hhh") {
  connections = buildConnections(getSampleInput(11.2).split("\n"));
}

const visited = new Map<string, number>();
function countPaths(key: string, seen: number): number {
  if (key === "dac") seen += 1;
  if (key === "fft") seen += 2;
  if (key === "out") return seen === 3 ? 1 : 0;

  const hash = `${key}:${seen}`;
  if (visited.has(hash)) return visited.get(hash)!;

  let total = 0;
  for (const output of connections[key]) {
    total += countPaths(output, seen);
  }
  visited.set(hash, total);
  return total;
}

const part2 = countPaths("svr", 0);
const p2End = performance.now();

console.log(`Part 1 Total Paths From 'you' to 'out': ${part1}`);
console.log(`Part 2 Total Paths From 'svr' to 'out' via 'dac' and 'fft': ${part2}`);
logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
