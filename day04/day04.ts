import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";

const warehouse = readInputFile(join(__dirname, "day04.txt"));

// prettier-ignore
const directions = [
	[-1, -1], [-1, 0], [-1, 1],
	[ 0, -1],          [ 0, 1],
	[ 1, -1], [ 1, 0], [ 1, 1]
];

let part1 = 0;

const adjacentRollsCount = Array.from({ length: warehouse.length }, () =>
  Array(warehouse[0].length).fill(0),
);
const rollsToRecheck: [number, number][] = [];

for (let row = 0; row < warehouse.length; row++) {
  for (let col = 0; col < warehouse[row].length; col++) {
    const cell = warehouse[row][col];
    if (cell !== "@") continue;
    let adjacentRolls = 0;
    for (const dir of directions) {
      let dRow = row + dir[0];
      let dCol = col + dir[1];
      // prettier-ignore
      if (dRow >= 0 && dRow < warehouse.length && dCol >= 0 && dCol < warehouse[row].length) {
				if (warehouse[dRow][dCol] === "@") adjacentRolls++;
			}
    }
    adjacentRollsCount[row][col] = adjacentRolls;
    if (adjacentRolls < 4) {
      part1++;
      rollsToRecheck.push([row, col]);
    }
  }
}

let part2 = 0;

while (rollsToRecheck.length > 0) {
  const [row, col] = rollsToRecheck.pop()!;
  if (warehouse[row][col] !== "@") continue;
  warehouse[row] =
    warehouse[row].slice(0, col) + "x" + warehouse[row].slice(col + 1);
  part2++;

  for (const dir of directions) {
    const dRow = row + dir[0];
    const dCol = col + dir[1];
    // prettier-ignore
    if (dRow >= 0 && dRow < warehouse.length && dCol >= 0 && dCol < warehouse[row].length) {
      if (warehouse[dRow][dCol] === "@") {
        adjacentRollsCount[dRow][dCol]--;
        if (adjacentRollsCount[dRow][dCol] < 4) {
          rollsToRecheck.push([dRow, dCol]);
        }
      }
    }
  }
}

console.log(`Part 1 Accessible rolls of paper: ${part1}`);
console.log(`Part 2 Number of rolls removed: ${part2}`);
