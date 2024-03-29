import { readFileSync } from 'fs';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));
const values = readFileSync(__dirname + '/2023/inputs/day05.input', 'utf8').split('\n\n');

let target = values[0].split(':')[1].trim().split(' ').map(v => + v);

function createMaps(s) {
  return s.split('\n').slice(1).map(v => v.split(' ').map(val => +val));
}

const maps = values.slice(1).map(createMaps);

for (const map of maps) {
  const nextTarget = [];
  for (const t of target) {
    let isAdded = false;
    for (const [dest, src, range] of map) {
      if (t >= src && t < src + range) {
        nextTarget.push(dest + t - src);
        isAdded = true;
      }
    }
    if (!isAdded) nextTarget.push(t);
  }
  target = nextTarget;
}

console.log('part 1', target.reduce((acc, curr) => Math.min(acc, curr), Infinity)); // NOT 73669231, IS 484023871

let targetRanges = values[0].split(':')[1].trim().split(' ').map(v => + v);

for (const map of maps) {
  const nextTargetRanges = [];
  for (let i = 0; i < targetRanges.length; i += 2) {
    let min = targetRanges[i];
    let max = min + targetRanges[i + 1] - 1;
    let isAdded = false;
    for (const [dest, src, range] of map) {
      // if (min >= src && min < src + range) {
      //   const last = Math.min(src + range - 1, max);
      //   nextTargetRanges.push(dest + min - src, dest + min - src + last);
      //   if (last < max) {
      //     console.log('adding a new range at the back')
      //     min = last + 1;
      //   } else {
      //     isAdded = true;
      //   }
      // } else if (max >= src && max < src + range) {
      //   console.log('adding a new range at the front')
      //   nextTargetRanges.push(dest, src + range - max + 1)
      //   max = src - 1;
      // }


      const firstSrc = src;
      const lastSrc = src + range - 1;
      if (min > lastSrc) continue;
      if (max < firstSrc) continue;
      // case 1: min/max fit in range
      if (min >= firstSrc && max <= lastSrc) {
        nextTargetRanges.push(dest + min - firstSrc, max - min + 1);
        isAdded = true;
      // case 2: max in range, min below range
      } else if (max <= lastSrc && min < firstSrc) {
        nextTargetRanges.push(dest, max - firstSrc + 1);
        max = firstSrc - 1;
      // case 3: min in range, max above range
      } else if (min >= firstSrc && max > lastSrc) {
        nextTargetRanges.push(dest + min - src, lastSrc - min + 1);
        min = lastSrc + 1;
      // case 4: range of dest fits within range of srcs
      } else if (min < firstSrc && max > lastSrc) {
        nextTargetRanges.push(dest, range);
        targetRanges.push(lastSrc + 1, max - lastSrc);
        max = firstSrc - 1;
      } else {
        console.log('unhandled case')
      }
    }
    if (!isAdded) nextTargetRanges.push(min, max - min + 1);
  }
  targetRanges = nextTargetRanges;
}

let p2Min = Infinity;

for (let i = 0; i < targetRanges.length; i += 2) {
  p2Min = Math.min(p2Min, targetRanges[i]);
}

console.log('part 2', p2Min); // NOT 6434225, too low, IS 46294175
