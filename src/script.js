import Grid from "./classes/Grid.js"
import Player from "./classes/Player.js"

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

ctx.imageSmoothingEnabled = false

const player = new Player(canvas.width, canvas.height)
const playerShot = []

const grid = new Grid(2, 5)

const keys = {
    left: false,
    rigth: false,
    shot: {
        pressed: false,
        released: true
    }
}

const drawShot = () => {
    playerShot.forEach((shot) => {
        shot.draw(ctx)
        shot.update()
    })
}

const clearShot = () => {
    playerShot.forEach((shot, index) => {
        if (shot.position.y <= 0) {
            playerShot.splice(index, 1)
        }
    })
}

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.draw(ctx)
    // grid.update()

    drawShot()
    clearShot()

    if (keys.shot.pressed && keys.shot.released) {
        player.shot(playerShot)
        keys.shot.released = false
    }

    if (keys.left && player.position.x >= 0) player.moveLeft()
    
    if (keys.rigth && player.position.x <= canvas.width - player.width) player.moveRigth()

    player.draw(ctx)

    requestAnimationFrame(gameLoop)
}

gameLoop()

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase()
    
    if (key === "a") keys.left = true

    if (key === "d") keys.rigth = true

    if (key === "enter") keys.shot.pressed = true
})

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase()
    
    if (key === "a") keys.left = false

    if (key === "d") keys.rigth = false

    if (key === "enter") {
        keys.shot.pressed = false
        keys.shot.released = true
    }
})
