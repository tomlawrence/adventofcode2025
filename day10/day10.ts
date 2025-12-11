import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day10.txt"));
const p1p2Start = performance.now();

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

const p1p2End = performance.now();

// After spending several hours learning about integer linear programming,
// ways to solve an ILP minimize problem using algos like Simplex and Branch-and-Bound,
// it seems like a pure code implementation with zero dependencies where I'm
// dealing with an input where the number of dimensions (i.e. button presses)
// is x[0]...x[joltages.length - 1] where joltages.length - 1 is up to 10.
// Writing a function from scratch that finds the "corners" of an up to 10 dimension
// feasible region and and selects the values for x[0]...x[n] to minimize Z
// is beyond my objective of practicing my data structures and algorithms skills.
// As of such, I'm using Microsoft Research's Z3 SMT solver with the help of AI for
// the second part of Day 10's challenge.

console.log(`Part 1 Fewest Button Presses: ${part1}`);
// console.log(`Part 2: ${part2}`);
logExecutionTimes({ start: p1p2Start, end: p1p2End });
