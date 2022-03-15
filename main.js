const canvas = document.querySelector("canvas");
const containerPontuacao = document.querySelector("#pontos")
const screenGameOver = document.querySelector("#screenGameOver")
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor(x, y, raio, cor) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.cor = cor;
    this.pontuacao = 0
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fillStyle = this.cor;
    ctx.fill();
  }
  setarPontuacao() {
    this.pontuacao += 50
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
const player = new Player(x, y, 10, "white");
const projeteis = [];
const enemies = [];
let animacaoID
let velocidadeInimigo = 1
function spawnEnemies() {
  setInterval(function () {
    const radius = Math.random() * (30 - 8) + 8;
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
      x: Math.cos(angulo) * velocidadeInimigo,
      y: Math.sin(angulo) * velocidadeInimigo
    };
    const enemy = new Enemy(x, y, radius, "green", velocidade);
    enemies.push(enemy);
  }, 2000);
}
function animate() {
  animacaoID = requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(1, 0, 0, 0.08)'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projeteis.forEach(function (projetil, indiceProjetil) {
    projetil.update();
    if (projetil.x - projetil.raio < 0 || projetil.x + projetil.raio > canvas.width
      || projetil.y - projetil.raio < 0 || projetil.y + projetil.raio > canvas.height) {
        setTimeout(function() { projeteis.splice(indiceProjetil, 1) }, 0)
    }
  });
  enemies.forEach(function (inimigo, indiceInimigo) {
    inimigo.update();
    const distancia = Math.hypot(player.x - inimigo.x, player.y - inimigo.y);
    if (distancia - inimigo.raio - player.raio < 1) {
      containerPontuacao.innerHTML = player.pontuacao + ' pontos'
      screenGameOver.style.display = 'flex'
      cancelAnimationFrame(animacaoID)
    }
    projeteis.forEach(function (projetil, indiceProjetil) {
      const distancia = Math.hypot(
        projetil.x - inimigo.x,
        projetil.y - inimigo.y
      );
      if (distancia - inimigo.raio - projetil.raio < 1) {
        setTimeout(function() {
          enemies.splice(indiceInimigo, 1);
          projeteis.splice(indiceProjetil, 1);
          player.setarPontuacao()
          velocidadeInimigo += 0.05
        }, 1)
      }
    });
  });
}

window.addEventListener("click", function (click) {
  const angulo = Math.atan2(click.clientY - y, click.clientX - x);
  const velocidade = {
    x: Math.cos(angulo) * 6,
    y: Math.sin(angulo) * 6
  };
  const projetil = new Projectile(x, y, 5, "white", velocidade);
  projeteis.push(projetil);
});

animate();
spawnEnemies();
