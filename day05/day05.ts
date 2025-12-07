import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day05.txt"));

const p1Start = performance.now();
const ranges = lines
  .slice(0, lines.indexOf(""))
  .map((range) => ({
    start: parseInt(range.split("-")[0]),
    end: parseInt(range.split("-")[1]),
  }))
  .sort((a, b) => a.start - b.start);

const ingredients = lines.slice(lines.indexOf("") + 1).map((line) => parseInt(line));

let part1 = 0;

for (const ingredient of ingredients) {
  for (const range of ranges) {
    if (ingredient >= range.start && ingredient <= range.end) {
      part1++;
      break;
    }
  }
}
const p1End = performance.now();

const p2Start = performance.now();
const newRanges = [];
newRanges.push(ranges[0]);

for (const range of ranges) {
  const last = newRanges.length - 1;
  if (range.start >= newRanges[last].start && range.start <= newRanges[last].end) {
    newRanges[last].end = Math.max(range.end, newRanges[last].end);
  } else {
    newRanges.push(range);
  }
}

let part2 = newRanges.reduce((total, range) => total + range.end - range.start + 1, 0);
const p2End = performance.now();

console.log(`Part 1 Fresh Ingredients Total: ${part1}`);
console.log(`Part 2 Ingredient ID Range Total: ${part2}`);
logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
