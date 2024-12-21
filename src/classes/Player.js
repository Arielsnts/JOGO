import { PATH_HERO } from "../utils/constants.js"
import Gunshot from "./Gunshot.js"

class Player{
    constructor(canvasWidth, canvasHeight) {
        this.width = 90
        this.heigth = 90
        this.velocity = 8
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.heigth - 25
        }

        this.image = this.getImage(PATH_HERO)
    }

    getImage(path) {
        const image = new Image()
        image.src = path
        return image
    }

    moveLeft() {
        this.position.x -= this.velocity
    }
    
    moveRigth() {
        this.position.x += this.velocity
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.heigth)
    }

    shot(playerShot) {
        const s = new Gunshot({
            x: (this.position.x + this.width / 2) + 7,
            y: this.position.y - 5
        }, -8)

        playerShot.push(s)
    }
}


export default Player
