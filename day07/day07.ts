import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day07.txt"));

const p1Start = performance.now();
const part1 = new Set<string>();
const beams = new Set<string>();
const beamStart = lines[0].indexOf("S");
const len = lines[0].length;

function spawnBeam(row: number, col: number) {
  beams.add(`${row},${col}`);
  for (let i = row + 1; i < lines.length; i++) {
    if (lines[i][col] === "^") {
      part1.add(`${i},${col}`);
      if (col - 1 >= 0 && !beams.has(`${i},${col - 1}`)) spawnBeam(i, col - 1);
      if (col + 1 < len && !beams.has(`${i},${col + 1}`)) spawnBeam(i, col + 1);
      return;
    } else {
      beams.add(`${i},${col}`);
    }
  }
}

spawnBeam(1, beamStart);
const p1End = performance.now();

console.log(`Part 1 Beams Split: ${part1.size}`);
logExecutionTimes({ start: p1Start, end: p1End });
