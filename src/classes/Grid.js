import Enemy from "./Enemy.js"

class Grid {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.enemyVelocity = 1

        this.direction = "right"
        this.moveDown = false

        this.enemies = this.init()
    }

    init() {
        const array = []

        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                const enemy = new Enemy({
                    x: col * 70 + 20,
                    y: row * 70 + 20
                }, this.enemyVelocity)
                array.push(enemy)
            }
        }
        return array
    }

    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx))
    }

    update(playerStatus) {

        if (this.boardRight()) {
            this.direction = "left"
            this.moveDown = true

        } else if (this.boardLeft()) {
            this.direction = "right"
            this.moveDown = true
        }

        if (!playerStatus) this.moveDown = false

        this.enemies.forEach((enemy) => {

            if (this.moveDown) {
                enemy.moveDown()
                enemy.velocity += 0.2
                this.enemyVelocity = enemy.velocity
            }
            
            if (this.direction === "right") enemy.moveRight()
            if (this.direction === "left") enemy.moveLeft()
        })

        this.moveDown = false
    }

    boardRight() {
        return this.enemies.some((enemy) => {
            return enemy.position.x + enemy.width >= innerWidth
        })
    }

    boardLeft() {
        return this.enemies.some((enemy) => {
            return enemy.position.x <= 0
        })
    }

    getRandom() {
        const index = Math.floor(Math.random() * this.enemies.length)
        return this.enemies[index]
    }

    restart() {
        this.enemies = this.init()
        this.direction = "right"
    }
}

export default Grid