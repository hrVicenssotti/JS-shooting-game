const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor(x, y, raio, cor) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.cor = cor;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor;
    ctx.fill();
  }
}
class Projectile {
  constructor(x, y, raio, cor, velocidade) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.cor = cor;
    this.velocidade = velocidade;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor;
    ctx.fill();
  }
  update() {
    this.draw();
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
  }
}

class Enemy {
  constructor(x, y, raio, cor, velocidade) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.cor = cor;
    this.velocidade = velocidade;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor;
    ctx.fill();
  }
  update() {
    this.draw();
    this.x += this.velocidade.x;
    this.y += this.velocidade.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, "blue");
const projeteis = [];
const enemies = [];

function spawnEnemies() {
  //   setInterval(function () {
  const radius = Math.random() * (30 - 4) + 4;
  let x;
  let y;
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
  }
  const angulo = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
  const velocidade = {
    x: Math.cos(angulo),
    y: Math.sin(angulo)
  };
  const enemy = new Enemy(x, y, radius, "green", velocidade);
  enemies.push(enemy);
  //   }, 1000);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projeteis.forEach(function (projetil) {
    projetil.update();
  });
  enemies.forEach(function (inimigo, indiceInimigo) {
    inimigo.update();
    const distancia = Math.hypot(player.x - inimigo.x, player.y - inimigo.y);
    projeteis.forEach(function (projetil, indiceProjetil) {
      const distancia = Math.hypot(
        projetil.x - inimigo.x,
        projetil.y - inimigo.y
      );
      if (distancia - inimigo.raio - projetil.raio < 1) {
        enemies.splice(indiceInimigo, 1);
        projeteis.splice(indiceProjetil, 1);
      }
    });
  });
}

window.addEventListener("click", function (click) {
  const angulo = Math.atan2(click.clientY - y, click.clientX - x);
  const velocidade = {
    x: Math.cos(angulo),
    y: Math.sin(angulo)
  };
  const projetil = new Projectile(x, y, 5, "red", velocidade);
  projeteis.push(projetil);
});

animate();
spawnEnemies();
