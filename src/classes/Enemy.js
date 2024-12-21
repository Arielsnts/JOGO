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

    shot(shotList) {
        const s = new Gunshot({
            x: (this.position.x + this.width / 2) - 9,
            y: this.position.y + this.heigth - 2
        }, 8)

        shotList.push(s)
    }

    hit(shot) {
        return (
        shot.position.x >= this.position.x &&
        shot.position.x <= this.position.x + this.width &&
        shot.position.y >= this.position.y &&
        shot.position.y <= this.position.y + this.width
        )
    }
}


export default Enemy
