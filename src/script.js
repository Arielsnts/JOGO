import Grid from "./classes/Grid.js"
import Obstacle from "./classes/Obstacle.js"
import Particle from "./classes/Particle.js"
import Player from "./classes/Player.js"
import { GAME_STATE } from "./utils/constants.js"

const startScreen = document.querySelector(".start-screen")
const gameOverScreen = document.querySelector(".game-over")
const score = document.querySelector(".scoreSect")
const scoreElement = document.querySelector(".score > span")
const levelElement = document.querySelector(".level > span")
const highElement = document.querySelector(".high > span")
const buttonPlay = document.querySelector(".play")
const buttonRestart = document.querySelector(".restart")

gameOverScreen.remove()

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

ctx.imageSmoothingEnabled = false

let currentState = GAME_STATE.START

const gameData = {
    score: 0,
    level: 1,
    high: 0
}

const player = new Player(canvas.width, canvas.height)

const playerShot = []
const enemyShot = []
const particles = []
const obstacles = []

const grid = new Grid(2, 4)

const keys = {
    left: false,
    rigth: false,
    shot: {
        pressed: false,
        released: true
    }
}

const showGameData = () => {
    scoreElement.textContent = gameData.score
    levelElement.textContent = gameData.level
    highElement.textContent = gameData.high
}

const incrementScore = (value) => {
    gameData.score += value

    if (gameData.score > gameData.high) [
        gameData.high = gameData.score
    ]
}

const initObstacles = () => {
    const x = canvas.width / 2 - 50
    const y = canvas.height - 250
    const offset = canvas.width * 0.15
    const color = "white"

    const Obstacle1 = new Obstacle({x: x - offset, y}, 100, 20, color)
    const Obstacle2 = new Obstacle({x: x + offset, y}, 100, 20, color)

    obstacles.push(Obstacle1)
    obstacles.push(Obstacle2)
}

initObstacles()

const bloodExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
        {
            x: position.x,
            y: position.y
        }, 
        {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5 
        }, 3, color)

        particles.push(particle)
    }
}

const drawBlood = () => {
    particles.forEach((particle) => {
        particle.draw(ctx)
        particle.update()
    })
}

const drawShot = () => {
    const shotList = [...playerShot, ...enemyShot]

    shotList.forEach((shot) => {
        shot.draw(ctx)
        shot.update()
    })
}

const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx))
}

const clearShot = () => {
    playerShot.forEach((shot, index) => {
        if (shot.position.y <= 0) {
            playerShot.splice(index, 1)
        }
    })
}

const clearBlood = () => {
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1)
        }
    })
}

const checkHitEnemy = () => {
    grid.enemies.forEach((enemy, enemyIndex) => {
        playerShot.some((shot, shotIndex) => {
            if (enemy.hit(shot)) {

                bloodExplosion({
                    x: enemy.position.x + enemy.width / 2,
                    y: enemy.position.y + enemy.heigth / 2
                }, 30, "red")

                incrementScore(50)

                grid.enemies.splice(enemyIndex, 1)
                playerShot.splice(shotIndex, 1)
            }
        })
    })
}

const checkHitHero = () => {
    enemyShot.some((shots, index) => {
        if (player.hit(shots)) {
            enemyShot.splice(index, 1)
            gameOver()
        }
    })
}

const checkHitObstacle = () => {
    obstacles.forEach((obstacle) => {
        playerShot.some((shots, index) => {
            if (obstacle.hit(shots)) {
                playerShot.splice(index, 1)
            }
        })

        enemyShot.some((shots, index) => {
            if (obstacle.hit(shots)) {
                enemyShot.splice(index, 1)
            }
        })
    })
}

const gameOver = () => {
    bloodExplosion(
        {
            x: player.position.x + player.width / 2, 
            y: player.position.y + player.heigth / 2
        }, 30, "red")
    
        player.alive = false

        currentState = GAME_STATE.GAME_OVER
        document.body.append(gameOverScreen)
}

const spawnGrid = () => {
    if (grid.enemies.length === 0) {
        grid.rows = Math.ceil(Math.random() *  3 + 1)
        grid.cols = Math.ceil(Math.random() *  7 + 1)
        grid.restart()
        gameData.level += 1
    }

}


const gameLoop = () => {
    if (currentState === GAME_STATE.PLAYING) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        showGameData()
        
        grid.draw(ctx)
        grid.update(player.alive)
        spawnGrid()
        
        checkHitEnemy()
        checkHitHero()
        checkHitObstacle()

        drawShot()
        drawBlood()
        drawObstacles()

        clearShot()
        clearBlood()


        if (keys.shot.pressed && keys.shot.released) {
            player.shot(playerShot)

            keys.shot.released = false
        }

        if (keys.left && player.position.x >= 0) player.moveLeft()
        
        if (keys.rigth && player.position.x <= canvas.width - player.width) player.moveRigth()
        
        player.draw(ctx)
    }

    if (currentState === GAME_STATE.GAME_OVER) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawBlood()
        drawShot()
        drawObstacles()

        checkHitObstacle()

        clearBlood()
        clearShot()

        grid.draw(ctx)
        grid.update(player.alive)
    }
    
    requestAnimationFrame(gameLoop)
}


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

buttonPlay.addEventListener("click", () => {
    startScreen.remove()
    score.style.display = "block" 
    currentState = GAME_STATE.PLAYING

    setInterval(() => {
        const enemy = grid.getRandom()
    
        if (enemy) {
            enemy.shot(enemyShot)
        }
    }, 600)
})

buttonRestart.addEventListener("click", () => {
    currentState = GAME_STATE.PLAYING
    player.alive = true

    grid.enemies.length = 0
    grid.enemyVelocity = 1.5

    enemyShot.length = 0

    gameData.score = 0
    gameData.level = 0

    gameOverScreen.remove()
})



gameLoop()
