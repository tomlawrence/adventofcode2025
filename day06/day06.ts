import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

// Discovering that trimmed whitespace at the start was causing me issues took me
// way too long to debug and figure out but I got there in the end!
const lines = readInputFile(join(__dirname, "day06.txt"), { trim: false });

function doOperator(problem: number[], operator: string): number {
  switch (operator) {
    case "+":
      return problem.reduce((total, num) => total + num, 0);
    case "*":
      return problem.reduce((total, num) => total * num, 1);
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

const p1Start = performance.now();
const p1Operators = lines.pop()!.trim().split(/\s+/);
const rows = lines.map((line) => line.trim().split(/\s+/).map(Number));
const p1Problems = rows[0].map((_, colIndex) => rows.map((row) => row[colIndex]));

const p1Results = p1Problems.map((problem, i) => doOperator(problem, p1Operators[i]));
const part1 = p1Results.reduce((total, num) => total + num, 0);

const p2Operators = [...p1Operators].reverse();
// Rotate the input 90° anticlockwise, not sure if this is the
// best approach but makes things much easier for me to solve
const colTotal = lines[0].length;
const p2Rows = Array.from({ length: colTotal }, (_, col) =>
  lines.map((row) => row[colTotal - 1 - col]).join(""),
);
const p1End = performance.now();

const p2Start = performance.now();
const p2Problems = [];
let problem = [];
for (const value of p2Rows) {
  if (value.trim() === "") {
    if (problem.length > 0) {
      p2Problems.push(problem);
      problem = [];
    }
  } else {
    problem.push(parseInt(value));
  }
}
p2Problems.push(problem);

const p2Results = p2Problems.map((problem, i) => doOperator(problem, p2Operators[i]));
const part2 = p2Results.reduce((total, num) => total + num, 0);
const p2End = performance.now();

console.log(`Part 1 Stacked Columns Total: ${part1}`);
console.log(`Part 2 Right to Left Columns Total: ${part2}`);
logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
