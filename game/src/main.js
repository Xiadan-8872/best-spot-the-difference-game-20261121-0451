// Bootstrap for Odd Twin: size the canvas, run the frame loop, stage ?shot=
// screenshots. One job: wire the game, input and renderer together.
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createGame, tick } from './game.js';
import { drawGame, FOOTER_BUTTONS } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

function fitCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = CANVAS_WIDTH * dpr;
  canvas.height = CANVAS_HEIGHT * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

fitCanvas();
window.addEventListener('resize', fitCanvas);

let game = createGame();
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) game = stageShot(shot, game);

attachInput(canvas, game, FOOTER_BUTTONS);

let last = performance.now();
function frame(now) {
  const dt = Math.min(now - last, 100);
  last = now;
  tick(game, dt, now);
  // Drop expired floaters and bursts so the arrays stay short.
  game.floaters = game.floaters.filter((f) => now < f.until);
  game.bursts = game.bursts.filter((b) => now - b.born < 550);
  drawGame(ctx, game, now);
  status.textContent = game.message;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
