let bild = document.getElementById("bild")
let context = bild.getContext("2d")
let map = []
for (let y = 0; y < 100; y++) {
    map.push([])
    for (let x = 0; x < 100; x++) {
        map[y].push(0)
    }
}
function next(posy, posx) {
    let enviroment_worth = map[posy][posx] + map[posy - 1][posx] + map[posy - 1][posx + 1] + map[posy][posx + 1] + map[posy + 1][posx + 1] + map[posy + 1][posx] + map[posy + 1][posx - 1] + map[posy][posx - 1] + map[posy - 1][posx - 1]
    if (enviroment_worth > 20) {
        return 0
    }
    if (enviroment_worth < 10) {
        return 0
    }
    return parseInt(enviroment_worth.toString().split("").pop())
}
console.log(next(1, 2))
console.log(map)
function iteration() {
    let map_new = []
    for (let y = 0; y < 100; y++) {
        map_new.push([])
        for (let x = 0; x < 100; x++) {
            map_new[y].push(0)
        }
    }
    for (let y = 1; y < 99; y++) {
        for (let x = 1; x < 99; x++) {
            map_new[y][x] = next(y, x)
        }
    }
    return map_new
}
console.log(map)
function draw_in_canvas() {
    for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
            switch (map[y][x]) {
                case 0:
                    context.fillStyle = "rgb(255 255 255)"
                    break;
                case 1:
                    context.fillStyle = "rgb(0 255 255)"
                    break;
                case 2:
                    context.fillStyle = "rgb(255 0 255)"
                    break;
                case 3:
                    context.fillStyle = "rgb(255 255 0)"
                    break;
                case 4:
                    context.fillStyle = "rgb(0 0 255)"
                    break;
                case 5:
                    context.fillStyle = "rgb(0 255 0)"
                    break;
                case 6:
                    context.fillStyle = "rgb(255 0 0)"
                    break;
                case 7:
                    context.fillStyle = "rgb(0 0 0)"
                    break;
                case 8:
                    context.fillStyle = "rgb(100 100 255)"
                    break;
                case 9:
                    context.fillStyle = "rgb(255 100 100)"
                    break;
            }
            context.fillRect(x * 10, y * 10, 10, 10)
        }
    }
}
draw_in_canvas()
let pause = true
let cursorx = 0
let cursory = 0
document.addEventListener("keydown", function addPixel(event) {
    context.strokeStyle = "rgb(255 255 255 )"
    context.strokeRect(cursorx * 10, cursory * 10, 10, 10)
    switch (event.key) {
        case "a":
            if (cursorx > 0) {
                cursorx--
            }
            break;
        case "w":
            if (cursory > 0) {
                cursory--
            }
            break;
        case "d":
            if (cursorx < 99) {
                cursorx++
            }
            break;
        case "s":
            if (cursory < 99) {
                cursory++
            }
            break;
        case " ":
            if (pause) {
                pause = false
            } else {
                pause = true
            }
            break;
        case "n":
            map = iteration()
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            map[cursory][cursorx] = parseInt(event.key)
            break;

    }
    draw_in_canvas()
    context.strokeStyle = "rgb(255 0 0)"
    context.strokeRect(cursorx * 10, cursory * 10, 10, 10)
})

setInterval(function () {
    if (!pause) {
        context.fillStyle = "rgb(0 0 0)"
        context.fillRect(0, 0, 1000, 1000)
        map = iteration()
        draw_in_canvas()
    }
}, 100)