import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const lines = readInputFile(join(__dirname, "day09.txt"));
const p1p2Start = performance.now();
const coords = lines.map((line) => line.split(",").map(Number) as Coord);

type Coord = [number, number];

// Raycasting
function isPointInPolygon(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];

    if (y1 > y !== y2 > y) {
      const xIntersect = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1);
      if (x < xIntersect) inside = !inside;
    }
  }
  return inside;
}

// prettier-ignore
function rectangleCrossesEdge(minX: number, minY: number, maxX: number, maxY: number): boolean {
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length]; // Loop back to first coord

    // Check horizontal polygon edge crossing vertical rectangle edges
    if (y1 === y2) {
      const edgeMinX = Math.min(x1, x2);
      const edgeMaxX = Math.max(x1, x2);
      if (y1 > minY && y1 < maxY) {
        if (
          (minX > edgeMinX && minX < edgeMaxX) ||
          (maxX > edgeMinX && maxX < edgeMaxX)
        ) {
          return true;
        }
      }
    }

    // Check vertical polygon edge crossing horizontal rectangle edges
    if (x1 === x2) {
      const edgeMinY = Math.min(y1, y2);
      const edgeMaxY = Math.max(y1, y2);
      if (x1 > minX && x1 < maxX) {
        if (
          (minY > edgeMinY && minY < edgeMaxY) ||
          (maxY > edgeMinY && maxY < edgeMaxY)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function isRectangleValid(a: Coord, b: Coord): boolean {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  if (rectangleCrossesEdge(minX, minY, maxX, maxY)) return false;
  if (!isPointInPolygon((minX + maxX) / 2, (minY + maxY) / 2)) return false; // Centre
  if (!isPointInPolygon((minX + maxX) / 2, minY)) return false; // Top edge
  if (!isPointInPolygon((minX + maxX) / 2, maxY)) return false; // Bottom edge
  if (!isPointInPolygon(minX, (minY + maxY) / 2)) return false; // Left edge
  if (!isPointInPolygon(maxX, (minY + maxY) / 2)) return false; // Right edge
  return true;
}

let part1 = 0;
let part2 = 0;

for (let i = 0; i < coords.length; i++) {
  for (let j = i + 1; j < coords.length; j++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[j];
    const area = (1 + Math.abs(x1 - x2)) * (1 + Math.abs(y1 - y2));
    if (area > part1) part1 = area;

    if (isRectangleValid(coords[i], coords[j])) {
      if (area > part2) part2 = area;
    }
  }
}
const p1p2End = performance.now();

console.log(`Part 1 Largest Area of Any Rectangle: ${part1}`);
console.log(`Part 2 Largest Area of Any Rectangle Within Perimeter: ${part2}`);
logExecutionTimes({ start: p1p2Start, end: p1p2End });
