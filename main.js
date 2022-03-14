const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, raio, cor) {
        this.x = x
        this.y = y
        this.raio = raio
        this.cor = cor
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI)
        ctx.fillStyle = this.cor
        ctx.fill()
    }
}
class Projectile {
    constructor (x, y, raio, cor, velocidade) {
        this.x = x
        this.y = y
        this.raio = raio
        this.cor = cor
        this.velocidade = velocidade
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI)
        ctx.fillStyle = this.cor
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocidade.x
        this.y += this.velocidade.y
    }
}
const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 30, 'blue')
const projeteis = []

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    projeteis.forEach(function(projetil) {
        projetil.update()
    })
    player.draw()
}

window.addEventListener('click', function(click) {
    const angulo = Math.atan2(click.clientY - y, click.clientX - x)
    const velocidade = {
        x: Math.cos(angulo),
        y: Math.sin(angulo)
    }
    const projetil = new Projectile(x, y, 5, 'red', velocidade)
    projeteis.push(projetil)
})
animate()