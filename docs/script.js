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
let selecting = false
let paste = []
let cursPos = cord(xy(size - 1)[0] >> 1, xy(size - 1)[1] >> 1)
let pressedKeys = new Set
let selected = new Set
let map = Array(size).fill(0)
const btn = document.getElementById("clear")
btn.onclick = () => {
 map = Array(size).fill(0)
 changed = true
}
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
 "c": copyLife,
 "v": pasteLife,
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
function addPos(posA, posB) {
 let [xA, yA] = xy(posA)
 let [xB, yB] = xy(posB)
 return cord(xA + xB, yA + yB)
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
function copyLife() {
 selecting = !selecting
 if (selecting) {
  return
 }
 let select = [...selected]
 let minx = 99
 let miny = 99
 for (let i = 0; i < select.length; i++) {
  select[i] = [xy(select[i]), map[select[i]]]
  minx = min(select[i][0][0], minx)
  miny = min(select[i][0][1], miny)
 }
 for (let i = 0; i < select.length; i++) {
  select[i][0] = cord(select[i][0][0] - minx, select[i][0][1] - miny)
 }
 let out = ""
 for (let i = select.length - 1; i > -1; i--) {
  out += select[i] + (i ? "," : "")
 }
 navigator.clipboard.writeText(out)
}
function pasteLife() {
 if (paste.length) {
  for (let i = 0; i < paste.length; i++) {
   map[addPos(paste[i][0], cursPos)] = paste[i][1]
  }
  paste = []
  return
 }
 navigator.clipboard.readText().then(text => {
  text = text.split(",")
  for (let i = 0; i < text.length; i += 2) {
   paste.push([~~text[i], ~~text[i + 1]])
  }
 })
}
function pixel(pos, type, mult = 1) {
 let col = colors[type]
 let rgb = "rgb("
 for (let i = 0; i < 3; i++) {
  rgb += ~~min(col[i] * mult, 255) + (i < 2 ? " " : "")
 }
 ctx.fillStyle = rgb + ")"
 ctx.fillRect(xy(pos)[0] * pixSize, xy(pos)[1] * pixSize, pixSize, pixSize)
}
function draw() {
 if (changed) {
  changed = false
  ctx.fillStyle = "rgb(255 255 255)"
  ctx.fillRect(0, 0, c.width, c.height)
  for (let pos = 0; pos < size; pos++) {
   if (map[pos]) {
    pixel(pos, map[pos])
   }
  }
  let select = [...selected]
  for (let i = 0; i < select.length; i++) {
   let pos = select[i]
   pixel(pos, map[pos], 0.5)
  }
  for (let i = 0; i < paste.length; i++) {
   pixel(addPos(paste[i][0], cursPos), paste[i][1])
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
c.addEventListener("click", (e) => {
 let rect = c.getBoundingClientRect()
 let x = ~~((e.clientX - rect.left) * c.width / rect.width / pixSize)
 let y = ~~((e.clientY - rect.top) * c.height / rect.height / pixSize)
 cursPos = cord(x, y)
 changed = true
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
 if (selecting && !selected.has(cursPos)) {
  selected.add(cursPos)
  changed = true
 } else if (!selecting && selected.size != 0) {
  selected = new Set
  changed = true
 }
}, 20)
setInterval(() => {
 if (!pause) {
  iter()
 }
}, 100)
requestAnimationFrame(draw)