import { readFileSync } from 'fs';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));
const inputArray = readFileSync(__dirname + '/inputs/day10.input', 'utf8').split('\n').map(voltage => +voltage);

let max = Math.max(...inputArray);
let voltages = new Set(inputArray);
// for (const voltage of inputArray) {
//   max = Math.max(max, voltage);
//   voltages.add(voltage);
// }

const partOne = () => {
  let curr = 0;
  let oneDiffs = 0;
  let threeDiffs = 0;

  while (curr < max) {
    if (voltages.has(curr + 1)) {
      oneDiffs++;
      curr = curr + 1;
    } else if (voltages.has(curr + 2)) {
      curr = curr + 2;
    } else if (voltages.has(curr + 3)) {
      threeDiffs++;
      curr = curr + 3;
    } else {
      throw new Error('this should be impossible');
    }
  }

  console.log('part one:', oneDiffs * (threeDiffs + 1)); // 2040
}

partOne();

const partTwo = () => {
  let dp = new Array(max + 1).fill(0);
  dp[0] = 1;
  if (voltages.has(1)) dp[1] = dp[0];
  if (voltages.has(2)) dp[2] = dp[0] + dp[1];
  for (let i = 3; i <= max; i++) {
    if (voltages.has(i)) {
      dp[i] += dp[i-3] + dp[i-2] + dp[i-1];
    }
  }

  console.log('part two:', dp[dp.length-1]); // 28346956187648
}

partTwo();