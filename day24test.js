const input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;

const inputArray = input.split('\n');

const parseSteps = str => {
  let res = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === 'n' || str[i] === 's') {
      res.push(str.substring(i, i+2));
      i++;
    } else {
      res.push(str[i]);
    }
  }
  return res;
}

const moves = inputArray.map(parseSteps);
let xMin = Infinity;
let xMax = -Infinity;
let yMin = Infinity;
let yMax = -Infinity;

const updateMinMax = (a, b) => {
  xMin = Math.min(xMin, +a);
  xMax = Math.max(xMax, +a);
  yMin = Math.min(yMin, +b);
  yMax = Math.max(yMax, +b);
}
const makeKey = (a, b) => 'x:' + a.toString() + ',y:' + b.toString();

let destinations = new Set();
for (const move of moves) {
  let x = 0;
  let y = 0;
  for (const step of move) {
    if (step === 'e') x += 2;
    else if (step === 'w') x -= 2;
    else if (step === 'nw') {
      x -= 1;
      y -= 1;
    }
    else if (step === 'se') {
      x += 1;
      y += 1;
    }
    else if (step === 'ne') {
      x += 1;
      y -= 1;
    }
    else if (step === 'sw') {
      x -= 1;
      y += 1;
    }
    else {
      throw new Error('this should be impossible');
    }
  }
  const key = makeKey(x, y);
  updateMinMax(x, y);
  if (destinations.has(key)) {
    destinations.delete(key);
  }
  else (destinations.add(key));
}

console.log('part one', destinations.size);

const checkNeighbors = (x, y, blacks) => {
  let total = 0;
  total += blacks.has(makeKey(x + 2, y)) + blacks.has(makeKey(x - 2, y)) + blacks.has(makeKey(x - 1, y - 1)) +
    blacks.has(makeKey(x + 1, y + 1)) + blacks.has(makeKey(x + 1, y - 1)) + blacks.has(makeKey(x - 1, y + 1));
  return total;
}

let round = 0;
const rounds = 100;
while (round < rounds) {
  if (Math.abs(xMin % 2) === 1) xMin--;
  if (Math.abs(yMin % 2) === 1) yMin--;
  if (xMax % 2 === 1) xMax++;
  if (yMax % 2 === 1) yMax++;
  const [currXMin, currYMin, currXMax, currYMax] = [xMin, yMin, xMax, yMax];
  let nextDestinations = new Set();
  // console.log('start of round', round);
  // console.log(xMin, yMin, xMax, yMax);
  for (let i = currXMin - 2; i <= currXMax + 4; i += 2) {
    for (let j = currYMin - 2; j <= currYMax + 4; j += 2) {
      for (let k = 0; k <= 1; k++) {
        const neighbors = checkNeighbors(i + k, j + k, destinations);
        const key = makeKey(i + k, j+ k);
        if (destinations.has(key)) {
          if (neighbors === 1 || neighbors === 2) {
            nextDestinations.add(key);
            updateMinMax(i + k, j + k);
          }
        } else {
          if (neighbors === 2) {
            nextDestinations.add(key);
            updateMinMax(i + k, j + k);
          }
        }
      }
    }
  }
  destinations = nextDestinations;
  console.log(round, destinations.size);
  round++;
}

// console.log(destinations);
console.log('destinations', destinations.size);
