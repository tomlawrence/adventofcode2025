import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day01.txt"));
const p1p2Start = performance.now();
const instructions = lines.map((line) => ({
  direction: line[0] as "L" | "R",
  steps: parseInt(line.slice(1)),
}));

let pos = 50;
let part1 = 0;
let part2 = 0;

for (const { direction, steps } of instructions) {
  if (direction === "L") {
    if (pos === 0) {
      part2 += Math.floor(steps / 100);
    } else if (steps >= pos) {
      part2 += Math.floor((steps - pos) / 100) + 1;
    }
    pos = (((pos - steps) % 100) + 100) % 100;
  } else if (direction === "R") {
    part2 += Math.floor((pos + steps) / 100);
    pos = (pos + steps) % 100;
  }
  if (pos === 0) part1++;
}
const p1p2End = performance.now();

console.log(`Part 1 Safe Password: ${part1}`);
console.log(`Part 2 Safe Password: ${part2}`);
logExecutionTimes({ start: p1p2Start, end: p1p2End });
