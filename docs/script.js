const c = document.getElementById("c")
c.style.position = "absolute"
c.style.left = "50%"
c.style.top = "50%"
c.style.transform = "translate(-50%, -50%)"
const ctx = c.getContext("2d")
const min = (a, b) => Math.min(a, b)
const kante = 100
const pixSize = ~~(min(window.innerWidth, window.innerHeight) / kante)
const size = kante ** 2
c.width = kante * pixSize
c.height = kante * pixSize
const xy = (pos) => [pos % kante, ~~(pos / kante)]
let pause = true
let changed = true
let cursPos = cord(xy(size - 1)[0] >> 1, xy(size - 1)[1] >> 1)
let map = Array(size).fill(0)
const env = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]
const colors = [
 [255, 255, 255],
 [0, 255, 255],
 [255, 0, 255],
 [255, 255, 0],
 [0, 0, 255],
 [0, 255, 0],
 [255, 0, 0],
 [0, 0, 0],
 [100, 100, 255],
 [255, 100, 100]
]
const slowAct = {
 " ": () => pause = !pause,
 "n": iter,
 "ArrowUp": () => cursPos = posRich(cursPos, 0),
 "ArrowRight": () => cursPos = posRich(cursPos, 1),
 "ArrowDown": () => cursPos = posRich(cursPos, 2),
 "ArrowLeft": () => cursPos = posRich(cursPos, 3)
}
const keyAct = {
 "w": () => cursPos = posRich(cursPos, 0),
 "d": () => cursPos = posRich(cursPos, 1),
 "s": () => cursPos = posRich(cursPos, 2),
 "a": () => cursPos = posRich(cursPos, 3),
 "0": () => map[cursPos] = 0,
 "1": () => map[cursPos] = 1,
 "2": () => map[cursPos] = 2,
 "3": () => map[cursPos] = 3,
 "4": () => map[cursPos] = 4,
 "5": () => map[cursPos] = 5,
 "6": () => map[cursPos] = 6,
 "7": () => map[cursPos] = 7,
 "8": () => map[cursPos] = 8,
 "9": () => map[cursPos] = 9
}
let pressedKeys = new Set()
function cord(x, y) {
 while (x >= kante) {
  x -= kante
 }
 while (y >= kante) {
  y -= kante
 }
 while (y < 0) {
  y += kante
 }
 while (x < 0) {
  x += kante
 }
 return y * kante + x
}
function posRich(pos, rich) {
 return cord(xy(pos)[0] + env[rich][0], xy(pos)[1] + env[rich][1])
}
function next(pos) {
 let sum = map[pos]
 for (let rich = 0; rich < 8; rich++) {
  sum += map[posRich(pos, rich)]
 }
 return 10 < sum && sum < 20 ? sum % 10 : 0
}
function iter() {
 let newMap = Array(size)
 for (let pos = 0; pos < size; pos++) {
  newMap[pos] = next(pos)
  if (newMap[pos] != map[pos]) {
   changed = true
  }
 }
 map = newMap
}
function draw() {
 if (changed) {
  changed = false
  ctx.fillStyle = "rgb(255 255 255)"
  ctx.fillRect(0, 0, c.width, c.height)
  for (let pos = 0; pos < size; pos++) {
   if (map[pos]) {
    let col = colors[map[pos]]
    ctx.fillStyle = `rgb(${col[0]} ${col[1]} ${col[2]})`
    ctx.fillRect(xy(pos)[0] * pixSize, xy(pos)[1] * pixSize, pixSize, pixSize)
   }
  }
  ctx.strokeStyle = "rgb(255 0 0)"
  ctx.strokeRect(xy(cursPos)[0] * pixSize, xy(cursPos)[1] * pixSize, pixSize, pixSize)
 }
 requestAnimationFrame(draw)
}
document.addEventListener("keydown", e => {
 if (slowAct[e.key]) {
  slowAct[e.key]()
  changed = true
 } else {
  pressedKeys.add(e.key)
 }
})
document.addEventListener("keyup", e => {
 pressedKeys.delete(e.key)
})
setInterval(() => {
 let keys = [...pressedKeys]
 for (let i = 0; i < keys.length; i++) {
  if (keyAct[keys[i]]) {
   keyAct[keys[i]]()
   changed = true
  }
 }
}, 20)
setInterval(() => {
 if (!pause) {
  iter()
 }
}, 100)
requestAnimationFrame(draw)