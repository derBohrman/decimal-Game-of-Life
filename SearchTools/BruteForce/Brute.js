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
function minSizeDif(){
 for (let i = 0;i< kante>>1;i++) {
  for (let j = i; j < kante-i; j++) {
   for (let l = 0; l < 4; l++) {
    if (map[posRich(cord(...edgePos[l](j)), l, i+1)]) {
     return -2*i+2
    }
   }
  }
 }
 return 1-kante
}
function iter() {
 let resize = minSizeDif()
 if (resize) {
  let newMap = Array(size(resize)).fill(0)
  let half = resize >> 1
  let lb = max(0, half)
  let ub = min(kante, kante + resize)
  for (let x = lb; x < ub; x++) {
   for (let y = lb; y < ub; y++) {
    newMap[cord(x + half, y + half, kante + resize)] = map[cord(x, y)]
   }
  }
  kante += resize
  map = newMap
 }
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
map = [
 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0,
 0, 5, 5, 5, 0,
 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0
]
iter()
print()
iter()
print()
iter()
print()
iter()
print()