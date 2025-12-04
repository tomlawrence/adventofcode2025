import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";

const warehouse = readInputFile(join(__dirname, "day04.txt"));

// prettier-ignore
const directions = [
	[-1, -1], [-1, 0], [-1, 1],
	[ 0, -1],          [ 0, 1],
	[ 1, -1], [ 1, 0], [ 1, 1]
];

const rolls: { row: number; col: number; adjacentRolls: number }[] = [];
let part1 = 0;
let part2 = 0;

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
    rolls.push({ row, col, adjacentRolls });
    if (adjacentRolls < 4) part1++;
  }
}

console.log(`Part 1 Accessible rolls of paper: ${part1}`);
console.log(`Part 2: ${part2}`);
