import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const batteries = readInputFile(join(__dirname, "day03.txt"));

const p1Start = performance.now();
let part1 = 0;

for (const bank of batteries) {
  let d1 = "0";
  let d2 = "0";
  for (let i = 0; i < bank.length - 1; i++) {
    const digit = bank[i];
    if (digit > d1) {
      d1 = digit;
      d2 = "0";
    } else if (digit > d2) {
      d2 = digit;
    }
  }
  if (bank[bank.length - 1] > d2) {
    d2 = bank[bank.length - 1];
  }
  part1 += parseInt(d1 + d2);
}
const p1End = performance.now();

const p2Start = performance.now();
let part2 = 0;

for (const bank of batteries) {
  let joltage = "";
  let startPos = 0;
  for (let len = 0; len < 12; len++) {
    let biggestDigit = "0";
    let endPos = bank.length - 11 + len;
    for (let i = startPos; i < endPos; i++) {
      const digit = bank[i];
      if (digit === "9") {
        biggestDigit = "9";
        startPos = i + 1;
        break;
      } else if (digit > biggestDigit) {
        biggestDigit = digit;
        startPos = i + 1;
      }
    }
    joltage += biggestDigit;
  }
  part2 += parseInt(joltage);
}
const p2End = performance.now();

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
