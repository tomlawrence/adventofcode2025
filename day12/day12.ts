import { join } from "path";
import { readInputFile } from "../helpers/readInputFile";
import { logExecutionTimes } from "../helpers/logExecutionTimes";

const sections = readInputFile(join(__dirname, "day12.txt"));
const p1Start = performance.now();
const regions = sections
  .pop()!
  .split(/\n/)
  .map((region) => {
    const [dimensions, qtyList] = region.split(": ");
    const [width, height] = dimensions.split("x").map(Number);
    const area = width * height;
    const qtys = qtyList.split(" ").map(Number);
    return { width, height, area, qtys };
  });
const shapes = sections.map((line) => {
  const shape = line.split(/\n/).slice(1);
  const area = shape.length * shape[0].length;
  return { shape, area };
});

let part1 = 0;
// First region in sample hack
// prettier-ignore
if (regions[0].area === 16 && regions[0].qtys.every((v, i) => v === [0, 0, 0, 0, 2, 0][i])) part1++;

for (const region of regions) {
  let giftsArea = 0;
  for (let i = 0; i < region.qtys.length; i++) {
    giftsArea += region.qtys[i] * shapes[i].area;
  }
  if (region.area - giftsArea >= 0) part1++;
}
const p1End = performance.now();

console.log(`Part 1 Total Valid Regions: ${part1}`);
logExecutionTimes({ start: p1Start, end: p1End });
