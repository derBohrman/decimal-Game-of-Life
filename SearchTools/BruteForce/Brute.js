let kante = 5
const size = (add = 0) => (kante + add) ** 2
let map = Array(size()).fill(0)
let living = Array(9).fill(0)
const min = (a, b) => Math.min(a, b)
const max = (a, b) => Math.max(a, b)
const xy = (pos) => [pos % kante, ~~(pos / kante)]
const env = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]
const edgePos = [a => [kante - 1 - a, kante - 1], a => [0, a], a => [a, 0], a => [kante - 1, kante - 1 - a]]
const cord = (x, y, kant = kante) => y * kant + x
function posRich(pos, rich, mul = 1) {
 return cord(xy(pos)[0] + env[rich][0] * mul, xy(pos)[1] + env[rich][1] * mul)
}
function print() {
 let out = ""
 for (let y = 0; y < kante; y++) {
  for (let x = 0; x < kante; x++) {
   out += map[cord(x, y)] + ","
  }
  out += "\n"
 }
 console.log(out)
}
function next(pos) {
 let sum = map[pos]
 for (let rich = 0; rich < 8; rich++) {
  sum += map[posRich(pos, rich)]
 }
 return 10 < sum && sum < 20 ? sum % 10 : 0
}
function minSizeDif() {
 for (let i = 0; i < kante >> 1; i++) {
  for (let j = i; j < kante - i; j++) {
   for (let l = 0; l < 4; l++) {
    if (map[posRich(cord(...edgePos[l](j)), l, i + 1)]) {
     return -2 * i + 2
    }
   }
  }
 }
 return 1 - kante
}
function shrinkMap(dif) {
 if (dif) {
  let newMap = Array(size(dif)).fill(0)
  let half = dif >> 1
  let lb = max(0, half)
  let ub = min(kante, kante + dif)
  for (let x = lb; x < ub; x++) {
   for (let y = lb; y < ub; y++) {
    newMap[cord(x + half, y + half, kante + dif)] = map[cord(x, y)]
   }
  }
  kante += dif
  map = newMap
 }
}
function iter() {
 shrinkMap(minSizeDif())
 living = Array(9).fill(0)
 let newMap = Array(size()).fill(0)
 for (let x = 1; x < kante - 1; x++) {
  for (let y = 1; y < kante - 1; y++) {
   let pos = cord(x, y)
   newMap[pos] = next(pos)
   living[newMap[pos] - 1]++
  }
 }
 map = newMap
}
function quickTest(structure) {
 kante = 5
 map = Array(size()).fill(0)
 let initialLife = Array(9).fill(0)
 for (let x = 1; x < kante - 1; x++) {
  for (let y = 1; y < kante - 1; y++) {
   map[cord(x, y)] = structure[cord(x - 1, y - 1, 3)]
   initialLife[map[cord(x, y)] - 1]++
  }
 }
 let sum = 1
 let exact = false
 let repeats = 10
 while (sum && !exact && repeats--) {
  iter()
  sum = 0
  exact = true
  for (let i = 0; i < 9; i++) {
   sum += living[i]
   if (living[i] != initialLife[i]) {
    exact = false
   }
  }
 }
 return exact
}
let found = 0
let start = Date.now()
for (let i = 0; i < 10000; i++) {
 let s = "" + i
 let struct = Array(9).fill(0)
 for (let j = 0; j < s.length; j++) {
  struct[j] = +s[j]
 }
 if (quickTest(struct)) {
  found++
  console.log(struct)
 }
}
console.log(((Date.now() - start) / 1000) + "s")
console.log(found + " structures")