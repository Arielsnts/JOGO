class Obstacle {
    constructor(position, width, heigth, color) {
        this.position = position
        this.width = width
        this.heigth = heigth
        this.color = color
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.heigth
        )
    }

    hit(shot) {
        const shotPositionY = 
            shot.velocity < 0
                ? shot.position.y + 100
                : shot.position.y + shot.heigth

        return (
            shot.position.x >= this.position.x &&
            shot.position.x <= this.position.x + this.width &&
            shotPositionY >= this.position.y &&
            shotPositionY <= this.position.y + this.width
            )
    }
}

export default Obstacle