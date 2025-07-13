"use strict"
let kante, map, living
let env = Array(8)
const size = (add = 0) => (kante + add) ** 2
const min = (a, b) => Math.min(a, b)
const max = (a, b) => Math.max(a, b)
const varEnv = [() => -kante, () => 1, () => kante, () => -1, () => 1 + kante, () => 1 - kante, () => -1 - kante, () => kante - 1]
const edgePos = [a => [kante - 1 - a, kante - 1], a => [0, a], a => [a, 0], a => [kante - 1, kante - 1 - a]]
const cord = (x, y, kant = kante) => y * kant + x
function next(pos) {
 let sum = map[pos]
 for (let dir = 0; dir < 8; dir++) {
  sum += map[pos + env[dir]]
 }
 return 10 < sum && sum < 20 ? sum % 10 : 0
}
function minSizeDif() {
 for (let i = 0; i < kante >> 1; i++) {
  for (let j = i; j < kante - i; j++) {
   for (let l = 0; l < 4; l++) {
    if (map[cord(...edgePos[l](j)) + env[l] * (i + 1)]) {
     return -2 * i + 2
    }
   }
  }
 }
 return 1 - kante
}
function setKante(a) {
 kante = a
 for (let i = 0; i < 8; i++) {
  env[i] = varEnv[i]()
 }
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
  setKante(kante + dif)
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
function quickTest(structure, newKant) {
 setKante(newKant + 2)
 map = Array(size()).fill(0)
 let initialLife = Array(9).fill(0)
 for (let i = 0; i < structure.length; i++) {
  let [x, y, type] = structure[i]
  map[cord(x + 1, y + 1)] = type
  initialLife[type - 1]++
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
function saveStruct() {
 let parts = []
 let minX = kante
 let minY = kante
 for (let x = 0; x < kante; x++) {
  for (let y = 0; y < kante; y++) {
   if (map[cord(x, y)]) {
    minX = min(minX, x)
    minY = min(minY, y)
    parts.push([x, y, , map[cord(x, y)]])
   }
  }
 }
 for (let i = 0; i < parts.length; i++) {
  parts[i][0] -= minX
  parts[i][1] -= minY
 }
 return parts
}
function longTest() {
 for (let i = 0; i < 100; i++) {
  iter()
 }
 let forms = []
 let sum = 1
 while (sum) {
  iter()
  let current = saveStruct() + ""
  for (let i = 0; i < forms.length; i++) {
   if (current == forms[i]) {
    return forms.length - i
   }
  }
  forms.push(current)
  sum = 0
  for (let i = 0; i < 9; i++) {
   sum += living[i]
  }
 }
 return false
}
function pm() {
 let out = ""
 for (let y = 0; y < kante; y++) {
  for (let x = 0; x < kante; x++) {
   if (map[cord(x, y)]) {
    out += map[cord(x, y)] + " "
   } else {
    out += "  "
   }
  }
  out += "\n"
 }
 console.log(out)
}
const options = [0,5]
let struct = [
 [0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0],
 [0, 1, 0], [1, 1, 0], [2, 1, 0], [3, 1, 0],
 [0, 2, 0], [1, 2, 0], [2, 2, 0], [3, 2, 0],
 [0, 3, 0], [1, 3, 0], [2, 3, 0], [3, 3, 0]
 ]
const strLen = struct.length
const optLen = options.length
let foundStructs = []
let found = 0
let start = Date.now()
let minSize = 0
for(let i = 0;i<strLen;i++){
 minSize = max(minSize, struct[i][0]+1,struct[i][1]+1)
}
for (let i = 0; i < optLen ** strLen; i++) {
 let combNum = i
 for (let j = strLen - 1; j > -1; j--) {
  let times = ~~(combNum / optLen ** j)
  combNum -= optLen ** j * times
  struct[j][2] = options[times]
 }
 if (quickTest(struct, minSize)) {
  let longRes = longTest()
  if (longRes) {
   let result = saveStruct()
   let add = true
   for (let i = 0; i < foundStructs.length; i++) {
    if (result + "" == foundStructs[i] + "") {
     add = false
     break
    }
   }
   if (add) {
    foundStructs.push(result)
    pm()
    console.log(longRes)
   }
  }
 }
}
console.log(((Date.now() - start) / 1000) + "s")
console.log(foundStructs.length + " structures")