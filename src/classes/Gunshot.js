class Gunshot {
    constructor(position, velocity) {
        this.position = position
        this.width = 4
        this.heigth = 20
        this.velocity = velocity
    }    

    draw(ctx) {
        ctx.fillStyle = "yellow"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.heigth)
    }

    update() {
        this.position.y += this.velocity
    }
}

export default Gunshot