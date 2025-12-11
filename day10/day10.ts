import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";
import { init } from "z3-solver";

const lines = readInputFile(join(__dirname, "day10.txt"));
const p1Start = performance.now();

type Machine = {
  lights: boolean[];
  buttons: number[][];
  joltage: number[];
};

const machines: Machine[] = lines.map((line) => {
  const machine = line.split(" ");
  return {
    lights: machine[0]
      .slice(1, -1)
      .split("")
      .map((light) => light === "#"),
    buttons: machine
      .slice(1, -1)
      .map((button) => button.slice(1, -1).split(",").map(Number)),
    joltage: machine[machine.length - 1].slice(1, -1).split(",").map(Number),
  };
});

function findMinButtonPresses(machine: Machine): number {
  const initial = Array.from({ length: machine.lights.length }, () => false);

  const stateToKey = (state: boolean[]) => state.map((b) => (b ? "1" : "0")).join("");
  const targetKey = stateToKey(machine.lights);
  const initialKey = stateToKey(initial);

  // BFS
  const queue: { state: boolean[]; presses: number }[] = [{ state: initial, presses: 0 }];
  const visited = new Set<string>([initialKey]);
  while (queue.length > 0) {
    const { state, presses } = queue.shift()!;

    for (let i = 0; i < machine.buttons.length; i++) {
      const newState = [...state];
      for (const lightIdx of machine.buttons[i]) {
        newState[lightIdx] = !newState[lightIdx];
      }
      const newKey = stateToKey(newState);
      if (newKey === targetKey) return presses + 1;
      if (!visited.has(newKey)) {
        visited.add(newKey);
        queue.push({ state: newState, presses: presses + 1 });
      }
    }
  }
  return 0;
}

let part1 = 0;
for (const machine of machines) {
  part1 += findMinButtonPresses(machine);
}

console.log(`Part 1: ${part1}\n`);
const p1End = performance.now();

// After spending several hours learning about integer linear programming,
// ways to solve an ILP minimize problem using algos like Simplex and Branch-and-Bound,
// it seems like a pure code implementation with zero dependencies where I'm
// dealing with an input where the number of dimensions (i.e. button presses)
// is x[0]...x[joltages.length - 1] where joltages.length - 1 is up to 10 (x ∈ Z^10).
// Writing a function from scratch that finds the "corners" of an up to 10 dimension
// feasible region and and selects the values for x[0]...x[n] to minimize Z
// is beyond my objective of practicing my data structures and algorithms skills.
// As of such, I'm using Z3 solver with the help of AI for the second part of Day 10.

const p2Start = performance.now();

async function solveJoltageZ3(machine: Machine): Promise<number> {
  const { Context } = await init();
  const Z3 = Context("main");
  const solver = new Z3.Optimize();

  const numButtons = machine.buttons.length;
  const buttonVars = Array.from({ length: numButtons }, (_, i) => Z3.Int.const(`x${i}`));

  // Add non-negativity constraints
  for (const x of buttonVars) {
    solver.add(x.ge(0)); // x >= 0
  }
  // Add constraints for each joltage position
  machine.joltage.forEach((target, jIdx) => {
    // Find all buttons that affect this joltage
    const affectingButtons = machine.buttons
      .map((button, bIdx) => ({ button, bIdx }))
      .filter(({ button }) => button.includes(jIdx))
      .map(({ bIdx }) => buttonVars[bIdx]);
    if (affectingButtons.length > 0) {
      // Sum of button presses must equal target
      const sum = affectingButtons.reduce((acc, x) => acc.add(x));
      solver.add(sum.eq(target));
    }
  });

  // Minimize total button presses
  const totalPresses = buttonVars.reduce((acc, x) => acc.add(x));
  solver.minimize(totalPresses);

  const result = await solver.check();

  if (result === "sat") {
    const model = solver.model();
    let total = 0;
    for (const x of buttonVars) {
      const value = model.eval(x);
      total += Number(value.toString());
    }
    return total;
  }
  return -1; // No solution
}

async function solvePart2() {
  let part2 = 0;

  console.log(`Solving Part 2...\n`);
  for (const [i, machine] of machines.entries()) {
    const fewestButtonPresses = await solveJoltageZ3(machine);
    console.log(`Machine ${i}: ${fewestButtonPresses}`);
    part2 += fewestButtonPresses;
  }
  const p2End = performance.now();

  console.log(`\nPart 1 Fewest Button Presses to Achieve Target Lights: ${part1}`);
  console.log(`Part 2 Fewest Button Presses to Achieve Targer Joltages: ${part2}`);
  logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
}

solvePart2();
