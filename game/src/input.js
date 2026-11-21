// Pointer and keyboard input: where a click lands, which key was pressed.
// One job: translate browser events into game calls, nothing else.
import {
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_Y,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  CURSOR_STEP,
  CURSOR_FINE_STEP,
  LENS_TOUCH_LIFT,
} from './config.js';
import {
  SCREEN_TITLE,
  SCREEN_PLAY,
  SCREEN_LEVEL_DONE,
  SCREEN_GAME_OVER,
  SCREEN_VICTORY,
  clickAt,
  useHint,
  startGame,
  startLevel,
  nextLevel,
  togglePause,
  toTitle,
  moveCursor,
  markCursor,
  toggleLens,
} from './game.js';
import { toggleMute, playClick } from './audio.js';

function panelHit(clientX, clientY, rect, scale) {
  const x = (clientX - rect.left) / scale;
  const y = (clientY - rect.top) / scale;
  let panel = null;
  let localX = 0;
  // The top 28px of each panel is a label ribbon, not clickable scene.
  const top = PANEL_Y + 28;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_WIDTH && y >= top && y <= PANEL_Y + PANEL_HEIGHT) {
    panel = 'left';
    localX = x - PANEL_LEFT_X;
  } else if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_WIDTH && y >= top && y <= PANEL_Y + PANEL_HEIGHT) {
    panel = 'right';
    localX = x - PANEL_RIGHT_X;
  }
  if (!panel) return null;
  return { panel, x: localX, y: y - PANEL_Y };
}

export function attachInput(canvas, game, buttons) {
  const rectOf = () => {
    const rect = canvas.getBoundingClientRect();
    return { rect, scale: rect.width / 1280 };
  };
  canvas.addEventListener('pointerdown', (event) => {
    const { rect, scale } = rectOf();
    // A mouse click takes over from the keyboard cursor.
    game.cursorVisible = false;
    const hit = panelHit(event.clientX, event.clientY, rect, scale);
    if (hit) {
      clickAt(game, hit.x, hit.y, performance.now());
      return;
    }
    // Footer buttons, in canvas coordinates.
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    for (const b of buttons) {
      if (b.visible(game) && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        playClick();
        b.onPress(game);
        return;
      }
    }
  });

  // The magnifier follows the pointer; on touch it sits above the fingertip
  // but still shows the scene under the finger.
  canvas.addEventListener('pointermove', (event) => {
    const { rect, scale } = rectOf();
    const hit = panelHit(event.clientX, event.clientY, rect, scale);
    if (!hit) {
      game.lensPos = null;
      return;
    }
    const lift = event.pointerType === 'touch' ? LENS_TOUCH_LIFT : 0;
    const cx = (event.clientX - rect.left) / scale;
    const cy = (event.clientY - rect.top) / scale - lift;
    game.lensPos = { cx, cy, panel: hit.panel, x: hit.x, y: hit.y };
  });
  canvas.addEventListener('pointerleave', () => {
    game.lensPos = null;
  });

  window.addEventListener('keydown', (event) => {
    const now = performance.now();
    const key = event.key.toLowerCase();
    if (key === 'm') {
      toggleMute();
      return;
    }
    if (game.screen === SCREEN_TITLE) {
      if (key === 'enter' || key === ' ') startGame(game);
      if (key === '1') startLevel(game, 0);
      if (key === '2') startLevel(game, 1);
      if (key === '3') startLevel(game, 2);
      if (key === '4') startLevel(game, 3);
      if (key === '5') startLevel(game, 4);
      if (key === '6') startLevel(game, 5);
      return;
    }
    if (game.screen === SCREEN_LEVEL_DONE) {
      if (key === 'enter' || key === 'n') nextLevel(game);
      return;
    }
    if (game.screen === SCREEN_GAME_OVER || game.screen === SCREEN_VICTORY) {
      if (key === 'enter' || key === 'r') startGame(game);
      if (key === 'escape') toTitle(game);
      return;
    }
    if (game.screen === SCREEN_PLAY) {
      if (key === 'h') useHint(game, now);
      if (key === 'p') togglePause(game);
      if (key === 'r') startLevel(game, game.levelIndex);
      if (key === 'l') toggleLens(game);
      if (key === 'escape') toTitle(game);
      // Keyboard cursor: arrows move, Enter/Space marks the spot.
      if (key.startsWith('arrow')) {
        event.preventDefault();
        const step = event.shiftKey ? CURSOR_FINE_STEP : CURSOR_STEP;
        if (key === 'arrowup') moveCursor(game, 0, -step);
        if (key === 'arrowdown') moveCursor(game, 0, step);
        if (key === 'arrowleft') moveCursor(game, -step, 0);
        if (key === 'arrowright') moveCursor(game, step, 0);
      }
      if (key === 'enter' || key === ' ') {
        event.preventDefault();
        markCursor(game, now);
      }
    }
  });
}
