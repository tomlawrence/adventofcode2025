import { readFileSync } from "fs";
import { join } from "path";

const lines = readFileSync(join(__dirname, "day01.txt"), "utf8")
  .trim()
  .split(/\r?\n/);

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

console.log(`Part 1 Safe Password: ${part1}`);
console.log(`Part 2 Safe Password: ${part2}`);
