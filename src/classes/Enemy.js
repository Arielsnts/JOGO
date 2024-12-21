import { PATH_ENEMY } from "../utils/constants.js"
import Gunshot from "./Gunshot.js"

class Enemy{
    constructor(position, velocity) {
        this.width = 70
        this.heigth = 70
        this.velocity = velocity
        this.position = position

        this.image = this.getImage(PATH_ENEMY)
    }

    getImage(path) {
        const image = new Image()
        image.src = path
        return image
    }

    moveLeft() {
        this.position.x -= this.velocity
    }
    
    moveRight() {
        this.position.x += this.velocity
    }

    moveDown() {
        this.position.y += this.heigth
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.heigth
        )
    }

    shot(playerShot) {
        const s = new Gunshot({
            x: (this.position.x + this.width / 2) + 7,
            y: this.position.y - 5
        }, -8)

        playerShot.push(s)
    }
}


export default Enemy
