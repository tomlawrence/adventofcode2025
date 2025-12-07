export function logExecutionTimes(times: {
  start: number;
  end: number;
  p2Start?: number;
  p2End?: number;
}) {
  console.log(`\n⏱️ Execution Times:\n`);
  if (times.p2Start !== undefined && times.p2End !== undefined) {
    console.log(`Part 1: ${(times.end - times.start).toFixed(3)} ms`);
    console.log(`Part 2: ${(times.p2End - times.p2Start).toFixed(3)} ms`);
  } else {
    console.log(`Part 1 + 2 (Combined): ${(times.end - times.start).toFixed(3)} ms`);
  }
}
