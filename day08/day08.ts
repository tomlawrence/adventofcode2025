import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day08.txt"));
const p1Start = performance.now();
const coords = lines.map((line) => line.split(",").map(Number));

type Point = number[];

function euclideanDistance(a: Point, b: Point): number {
  return Math.sqrt(a.reduce((sum, aCoord, i) => sum + (aCoord - b[i]) ** 2, 0));
}
// testing with 3-4-5 triangle
// console.log(euclideanDistance([0, 0, 0], [4, 3, 0]));

const connections: { i: number; j: number; distance: number }[] = [];
for (let i = 0; i < coords.length; i++) {
  for (let j = i + 1; j < coords.length; j++) {
    connections.push({ i, j, distance: euclideanDistance(coords[i], coords[j]) });
  }
}
connections.sort((a, b) => a.distance - b.distance);

function unionFind(len: number) {
  const parent = Array.from({ length: len }, (_, i) => i);
  let count = len;
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  }
  function union(a: number, b: number) {
    const pa = find(a);
    const pb = find(b);
    if (pa !== pb) {
      parent[pa] = pb;
      count--;
    }
  }
  return { find, union, parent, getCount: () => count };
}

function getCircuits(uf: ReturnType<typeof unionFind>, numOfCircuits: number) {
  const circuits: Record<number, number[]> = {};
  for (let i = 0; i < numOfCircuits; i++) {
    const key = uf.find(i);
    (circuits[key] ??= []).push(i);
  }
  return circuits;
}

let part2 = 0;
const uf = unionFind(coords.length);
for (const connection of connections.slice(0, 1000)) {
  uf.union(connection.i, connection.j);
  if (uf.getCount() === 1 && !part2) {
    part2 = coords[connection.i][0] * coords[connection.j][0];
  }
}
const circuits = getCircuits(uf, coords.length);

const part1 = Object.values(circuits)
  .map((circuit) => circuit.length)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((sum, a) => sum * a);

const p1End = performance.now();

const p2Start = performance.now();
for (const connection of connections.slice(1000)) {
  uf.union(connection.i, connection.j);
  if (uf.getCount() === 1 && !part2) {
    part2 = coords[connection.i][0] * coords[connection.j][0];
    break;
  }
}
const p2End = performance.now();

console.log(
  `Part 1 Product of Sizes of 3 Largest Circuits After 1000 Connections: ${part1}`,
);
console.log(
  `Part 2 Product of X Coordinates of First Junction Boxes to Make All Junction Boxes on Same Circuit: ${part2}`,
);
logExecutionTimes({ start: p1Start, end: p1End, p2Start: p2Start, p2End: p2End });
