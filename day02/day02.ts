import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day02.txt"));
const p1p2Start = performance.now();
const ranges = lines[0].split(",").map((range) => {
  const [start, end] = range.split("-").map(Number);
  return { start, end };
});

let part1 = 0;
let part2 = 0;

for (const { start, end } of ranges) {
  for (let i = start; i <= end; i++) {
    part1 += /^(\d+)\1$/.test(String(i)) ? i : 0;
    part2 += /^(\d+)\1+$/.test(String(i)) ? i : 0;
  }
}
const p1p2End = performance.now();

console.log(`Part 1 IDs (digits repeated twice) sum: ${part1}`);
console.log(`Part 2 IDs (digits repeated at least twice) sum: ${part2}`);
logExecutionTimes({ start: p1p2Start, end: p1p2End });
