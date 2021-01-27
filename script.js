'use strict';

let cvsWidth = 600,
  cvsHeight = 600;

let aircraftWidth = 14,
  aircraftHeight = 14,
  aircraftX = 293,
  aircraftY = 293;

let bullets = [];
let size = 7;

let frameRate = 10;
let score = 0,
  highestScore = 0;
let requestID;

/* Helper */
const random = (min, max) => {
  let num = Math.floor(Math.random() * (max - min)) + min;
  if (num === 0) {
    num = Math.floor(Math.random() * (max - min)) + min;
  }
  return num;
};

/* Rendering Context */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* Draw Aircraft */
const drawAircraft = () => {
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(aircraftX, aircraftY, aircraftWidth, aircraftHeight);
};

/* Move Aircraft*/
const aircraft = (e) => {
  ctx.clearRect(aircraftX, aircraftY, aircraftWidth, aircraftHeight);

  switch (e.code) {
    case 'ArrowLeft':
      aircraftX -= frameRate;
      break;
    case 'ArrowRight':
      aircraftX += frameRate;
      break;
    case 'ArrowUp':
      aircraftY -= frameRate;
      break;
    case 'ArrowDown':
      aircraftY += frameRate;
      break;
  }

  /* Through the wall */
  if (aircraftX > cvsWidth) {
    aircraftX -= cvsWidth;
  } else if (aircraftX < 0) {
    aircraftX += cvsWidth;
  } else if (aircraftY > cvsHeight) {
    aircraftY -= cvsHeight;
  } else if (aircraftY < 0) {
    aircraftY += cvsHeight;
  }

  drawAircraft();
};
window.addEventListener('keydown', aircraft);

/* Bullet */
class Bullet {
  constructor(x, y, accX, accY, color, size) {
    this.x = x;
    this.y = y;
    this.accX = accX;
    this.accY = accY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= cvsWidth || this.x - this.size <= 0) {
      this.accX = -this.accX;
      this.color = `rgb(${random(0, 254)}, ${random(0, 254)}, ${random(
        0,
        254
      )})`;
    } else if (this.y + this.size >= cvsHeight || this.y - this.size <= 0) {
      this.accY = -this.accY;
      this.color = `rgb(${random(0, 254)}, ${random(0, 254)}, ${random(
        0,
        254
      )})`;
    }
    this.x += this.accX;
    this.y += this.accY;
  }
}

/* Generate Bullet */
const generateBullet = () => {
  let bullet = new Bullet(
    random(0 + size, cvsWidth - size),
    random(0 + size, cvsHeight - size),
    random(-3.5, 3.5),
    random(-3.5, 3.5),
    `rgb(${random(0, 254)}, ${random(0, 254)}, ${random(0, 254)})`,
    size
  );

  bullets.push(bullet);
};

const generateTimer = setInterval(generateBullet, 1000);
if (bullets.length >= 40) {
  clearInterval(generateTimer);
}

/* End Game */
const endGame = () => {
  for (let i = 0; i < bullets.length; i++) {
    let dx = aircraftX - bullets[i].x,
      dy = aircraftY - bullets[i].y;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    if (distance < ((aircraftWidth + size) * 2) / 3) {
      window.removeEventListener('keydown', aircraft);

      if (requestID) {
        window.cancelAnimationFrame(requestID);
        requestID = undefined;
      }
    }
  }
};

/* Start Game */
const startGame = () => {
  requestID = undefined;
  ctx.fillStyle = 'rgba(0, 0, 0, .2)';
  ctx.fillRect(0, 0, cvsWidth, cvsHeight);

  drawAircraft();

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].draw();
    bullets[i].update();
  }

  if (!requestID) {
    requestID = window.requestAnimationFrame(startGame);
  }

  setInterval(() => {
    score++;
  }, 1000);

  document.getElementById('score').innerText = `SCORE: ${score}`;

  endGame();
};

/* Restart Game */
const restartGame = () => {
  window.location.reload();
};
