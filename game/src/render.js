// All canvas drawing: header, panels, found markers, HUD and every screen.
// One job: turn the game state into pixels. It never changes the state.
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  HEADER_HEIGHT,
  FOOTER_TOP,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_Y,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  LEVELS,
  COLORS,
} from './config.js';
import { SCENES } from './scenes.js';
import {
  SCREEN_TITLE,
  SCREEN_PLAY,
  SCREEN_LEVEL_DONE,
  SCREEN_GAME_OVER,
  SCREEN_VICTORY,
  foundCount,
  remainingCount,
  levelDiffs,
} from './game.js';
import { useHint, startLevel, startGame, nextLevel, togglePause, toTitle } from './game.js';
import { toggleMute, isMuted } from './audio.js';

/** Footer buttons the input layer clicks; each decides when it shows. */
export const FOOTER_BUTTONS = [
  {
    x: 40, y: 668, w: 150, h: 44, label: 'Hint  (H)',
    visible: (g) => g.screen === SCREEN_PLAY,
    onPress: (g) => useHint(g, performance.now()),
  },
  {
    x: 206, y: 668, w: 150, h: 44, label: 'Pause  (P)',
    visible: (g) => g.screen === SCREEN_PLAY,
    onPress: (g) => togglePause(g),
  },
  {
    x: 372, y: 668, w: 150, h: 44, label: 'Restart  (R)',
    visible: (g) => g.screen === SCREEN_PLAY,
    onPress: (g) => startLevel(g, g.levelIndex),
  },
  {
    x: 538, y: 668, w: 150, h: 44, label: 'Menu  (Esc)',
    visible: (g) => g.screen === SCREEN_PLAY,
    onPress: (g) => toTitle(g),
  },
  {
    x: 1090, y: 668, w: 150, h: 44, label: 'Sound  (M)',
    visible: (g) => g.screen === SCREEN_PLAY || g.screen === SCREEN_TITLE,
    onPress: () => toggleMute(),
  },
];

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function formatTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawPanel(g, game, panelX, right, now) {
  g.save();
  g.beginPath();
  g.rect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  g.clip();
  g.translate(panelX, PANEL_Y);
  SCENES[game.levelIndex].draw(g, right);
  // Found markers: a green ring and check on BOTH panels.
  const diffs = levelDiffs(game);
  for (const i of game.found) {
    const d = diffs[i];
    g.strokeStyle = COLORS.foundRing;
    g.lineWidth = 5;
    g.beginPath();
    g.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = COLORS.foundRing;
    g.beginPath();
    g.arc(d.x + d.r * 0.55, d.y + d.r * 0.55, 13, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#ffffff';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(d.x + d.r * 0.55 - 6, d.y + d.r * 0.55);
    g.lineTo(d.x + d.r * 0.55 - 1, d.y + d.r * 0.55 + 5);
    g.lineTo(d.x + d.r * 0.55 + 7, d.y + d.r * 0.55 - 5);
    g.stroke();
  }
  // Hint reveal: a pulsing gold ring around the hinted difference.
  if (game.hintReveal && now < game.hintReveal.until) {
    const d = diffs[game.hintReveal.diffIndex];
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    g.strokeStyle = COLORS.hintRing;
    g.lineWidth = 5;
    g.setLineDash([12, 8]);
    g.beginPath();
    g.arc(d.x, d.y, (d.r + 8) * pulse, 0, Math.PI * 2);
    g.stroke();
    g.setLineDash([]);
  }
  // Particle bursts where a difference was just found.
  for (const b of game.bursts) {
    const age = now - b.born;
    if (age > 550) continue;
    const t = age / 550;
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      const dist = 8 + t * 34;
      g.globalAlpha = 1 - t;
      g.fillStyle = i % 2 ? '#ffb703' : '#2a9d8f';
      g.beginPath();
      g.arc(b.x + Math.cos(a) * dist, b.y + Math.sin(a) * dist, 4 - t * 2, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  g.restore();
  // Panel frame and label ribbon inside the top of the panel.
  g.strokeStyle = COLORS.panelBorder;
  g.lineWidth = 4;
  g.strokeRect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  g.fillStyle = COLORS.panelBorder;
  g.fillRect(panelX, PANEL_Y, PANEL_WIDTH, 28);
  g.fillStyle = '#ffffff';
  g.font = 'bold 16px system-ui, sans-serif';
  g.textAlign = 'left';
  g.fillText(right ? 'RIGHT — THE TWIN' : 'LEFT — THE ORIGINAL', panelX + 10, PANEL_Y + 20);
  // Wrong-click flash.
  if (game.wrongFlash && now < game.wrongFlash.until) {
    const w = game.wrongFlash;
    const wx = panelX + w.x;
    const wy = PANEL_Y + w.y;
    g.strokeStyle = COLORS.bad;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(wx - 12, wy - 12);
    g.lineTo(wx + 12, wy + 12);
    g.moveTo(wx + 12, wy - 12);
    g.lineTo(wx - 12, wy + 12);
    g.stroke();
  }
}

function drawHeader(g, game) {
  g.fillStyle = COLORS.headerBg;
  g.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
  g.fillStyle = '#ffffff';
  g.textAlign = 'left';
  g.font = 'bold 30px system-ui, sans-serif';
  g.fillText('ODD TWIN', 40, 40);
  g.font = '15px system-ui, sans-serif';
  g.fillStyle = '#ffd166';
  g.fillText('spot the difference', 40, 64);
  const level = LEVELS[game.levelIndex];
  g.textAlign = 'center';
  g.fillStyle = '#ffffff';
  g.font = 'bold 26px system-ui, sans-serif';
  if (game.screen === SCREEN_PLAY || game.screen === SCREEN_LEVEL_DONE || game.screen === SCREEN_GAME_OVER) {
    g.fillText(`FOUND ${foundCount(game)} / ${level.diffs}  ·  ${remainingCount(game)} TO GO`, 640, 38);
    g.font = '16px system-ui, sans-serif';
    g.fillStyle = '#ffd166';
    g.fillText(`${level.name}  —  Level ${game.levelIndex + 1} of 3`, 640, 64);
  } else {
    g.fillText('THREE SCENES · 22 DIFFERENCES', 640, 38);
    g.font = '16px system-ui, sans-serif';
    g.fillStyle = '#ffd166';
    g.fillText('click a difference in either picture', 640, 64);
  }
  // Timer bar and score, right side.
  const total = level.seconds * 1000;
  const frac = Math.max(0, game.timeLeftMs / total);
  const low = game.timeLeftMs <= 10000 && game.screen === SCREEN_PLAY;
  g.textAlign = 'right';
  g.font = 'bold 26px system-ui, sans-serif';
  g.fillStyle = low ? '#ff6b6b' : '#ffffff';
  g.fillText(formatTime(game.timeLeftMs), 1240, 40);
  g.fillStyle = 'rgba(255,255,255,0.25)';
  g.fillRect(1020, 52, 220, 10);
  g.fillStyle = low ? '#e63946' : '#2a9d8f';
  g.fillRect(1020, 52, 220 * frac, 10);
  g.font = '16px system-ui, sans-serif';
  g.fillStyle = '#ffd166';
  g.fillText(`SCORE ${game.score}`, 1240, 82);
  if (game.combo >= 2 && game.screen === SCREEN_PLAY) {
    g.fillStyle = '#ffb703';
    g.font = 'bold 16px system-ui, sans-serif';
    g.fillText(`COMBO ×${game.combo}`, 1000, 82);
  }
}

function drawFooter(g, game, now) {
  g.fillStyle = COLORS.paper;
  g.fillRect(0, FOOTER_TOP, CANVAS_WIDTH, CANVAS_HEIGHT - FOOTER_TOP);
  for (const b of FOOTER_BUTTONS) {
    if (!b.visible(game)) continue;
    const disabled = b.label.startsWith('Hint') && (game.hintsLeft <= 0 || now < game.hintCooldownUntil);
    g.fillStyle = disabled ? '#adb5bd' : COLORS.accent;
    roundRect(g, b.x, b.y, b.w, b.h, 10);
    g.fill();
    g.fillStyle = '#20242e';
    g.font = 'bold 16px system-ui, sans-serif';
    g.textAlign = 'center';
    const label = b.label.startsWith('Hint') ? `Hint (${game.hintsLeft})  H` : b.label.startsWith('Sound') ? (isMuted() ? 'Muted  (M)' : 'Sound  (M)') : b.label;
    g.fillText(label, b.x + b.w / 2, b.y + 28);
  }
  g.fillStyle = COLORS.ink;
  g.font = '17px system-ui, sans-serif';
  g.textAlign = 'left';
  g.fillText(game.message, 40, 752);
  // Progress dots for the level's differences.
  const diffs = levelDiffs(game);
  diffs.forEach((d, i) => {
    const x = 1090 + i * 22;
    g.fillStyle = game.found.includes(i) ? COLORS.good : '#d9d9d9';
    g.beginPath();
    g.arc(x, 744, 8, 0, Math.PI * 2);
    g.fill();
    if (game.found.includes(i)) {
      g.strokeStyle = '#ffffff';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x - 4, 744);
      g.lineTo(x - 1, 747);
      g.lineTo(x + 5, 740);
      g.stroke();
    }
  });
}

function overlay(g, alpha) {
  g.fillStyle = `rgba(16,18,28,${alpha})`;
  g.fillRect(0, HEADER_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - HEADER_HEIGHT);
}

function centreCard(g, x, y, w, h) {
  g.fillStyle = COLORS.paper;
  roundRect(g, x, y, w, h, 18);
  g.fill();
  g.strokeStyle = COLORS.ink;
  g.lineWidth = 3;
  roundRect(g, x, y, w, h, 18);
  g.stroke();
}

function drawTitle(g, game) {
  overlay(g, 0.55);
  centreCard(g, 190, 130, 900, 540);
  g.textAlign = 'center';
  g.fillStyle = COLORS.ink;
  g.font = 'bold 54px system-ui, sans-serif';
  g.fillText('ODD TWIN', 640, 200);
  g.font = '22px system-ui, sans-serif';
  g.fillStyle = '#5a5a5a';
  g.fillText('Two pictures. One is lying. Find every difference.', 640, 236);
  // Three scene thumbnails with their names.
  LEVELS.forEach((level, i) => {
    const x = 250 + i * 270;
    const y = 268;
    g.save();
    g.beginPath();
    g.rect(x, y, 220, 150);
    g.clip();
    g.translate(x, y);
    g.scale(220 / 560, 150 / 520);
    SCENES[i].draw(g, false);
    g.restore();
    g.strokeStyle = COLORS.ink;
    g.lineWidth = 3;
    g.strokeRect(x, y, 220, 150);
    g.fillStyle = COLORS.ink;
    g.font = 'bold 17px system-ui, sans-serif';
    g.fillText(level.name, x + 110, y + 176);
    g.font = '14px system-ui, sans-serif';
    g.fillStyle = '#5a5a5a';
    g.fillText(level.tag, x + 110, y + 198);
  });
  g.fillStyle = COLORS.ink;
  g.font = '17px system-ui, sans-serif';
  g.fillText('Click a difference in either picture · wrong clicks cost 25 pts and 2 seconds', 640, 510);
  g.fillText('H hint (3 per level) · P pause · R restart · M sound · 1 / 2 / 3 jump to a level', 640, 538);
  g.fillStyle = COLORS.accentDark;
  g.font = 'bold 24px system-ui, sans-serif';
  g.fillText('▶  Press ENTER to start hunting', 640, 596);
}

function drawLevelDone(g, game) {
  overlay(g, 0.45);
  centreCard(g, 390, 220, 500, 330);
  g.textAlign = 'center';
  g.fillStyle = COLORS.good;
  g.font = 'bold 40px system-ui, sans-serif';
  g.fillText('LEVEL CLEAR!', 640, 290);
  g.fillStyle = '#ffb703';
  g.font = '44px system-ui, sans-serif';
  g.fillText('★'.repeat(game.stars) + '☆'.repeat(3 - game.stars), 640, 350);
  g.fillStyle = COLORS.ink;
  g.font = '19px system-ui, sans-serif';
  g.fillText(`${LEVELS[game.levelIndex].name} — all ${LEVELS[game.levelIndex].diffs} differences found`, 640, 396);
  g.fillText(`Time bonus +${game.levelTimeBonus}  ·  Score ${game.score}`, 640, 428);
  g.fillStyle = COLORS.accentDark;
  g.font = 'bold 22px system-ui, sans-serif';
  g.fillText('Press N or ENTER for the next level', 640, 488);
}

function drawGameOver(g, game) {
  overlay(g, 0.5);
  centreCard(g, 390, 220, 500, 330);
  g.textAlign = 'center';
  g.fillStyle = COLORS.bad;
  g.font = 'bold 40px system-ui, sans-serif';
  g.fillText("TIME'S UP!", 640, 292);
  g.fillStyle = COLORS.ink;
  g.font = '19px system-ui, sans-serif';
  g.fillText(`You found ${foundCount(game)} of ${LEVELS[game.levelIndex].diffs} differences in ${LEVELS[game.levelIndex].name}.`, 640, 348);
  g.fillText(`Score ${game.score}  ·  Best combo ×${game.bestCombo}`, 640, 382);
  g.fillText('The unfound ones were hiding in plain sight.', 640, 414);
  g.fillStyle = COLORS.accentDark;
  g.font = 'bold 22px system-ui, sans-serif';
  g.fillText('Press R to retry the level', 640, 488);
}

function drawVictory(g, game) {
  overlay(g, 0.45);
  centreCard(g, 340, 190, 600, 380);
  g.textAlign = 'center';
  g.fillStyle = COLORS.good;
  g.font = 'bold 42px system-ui, sans-serif';
  g.fillText('YOU FOUND THEM ALL!', 640, 262);
  g.fillStyle = '#ffb703';
  g.font = '44px system-ui, sans-serif';
  g.fillText('★★★', 640, 322);
  g.fillStyle = COLORS.ink;
  g.font = '19px system-ui, sans-serif';
  g.fillText('All 22 differences across three scenes — every twin matched.', 640, 368);
  g.fillText(`Final score ${game.score}  ·  Best combo ×${game.bestCombo}  ·  Misses ${game.misses}`, 640, 402);
  g.fillText('Thanks for playing Odd Twin!', 640, 434);
  g.fillStyle = COLORS.accentDark;
  g.font = 'bold 22px system-ui, sans-serif';
  g.fillText('Press R to play again', 640, 500);
}

function drawFloaters(g, game, now) {
  g.textAlign = 'center';
  for (const f of game.floaters) {
    if (now > f.until) continue;
    const t = 1 - (f.until - now) / 1100;
    g.globalAlpha = 1 - t;
    g.fillStyle = f.color;
    g.font = 'bold 22px system-ui, sans-serif';
    // Floaters are stored panel-local; show them over the left panel.
    g.fillText(f.text, PANEL_LEFT_X + f.x, PANEL_Y + f.y - t * 26);
  }
  g.globalAlpha = 1;
}

/** Draw one frame. `now` is performance.now(). */
export function drawGame(g, game, now) {
  g.fillStyle = COLORS.paper;
  g.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHeader(g, game);
  if (game.screen === SCREEN_TITLE) {
    // A dimmed preview of level 1 behind the title card.
    drawPanel(g, { ...game, found: [], hintReveal: null, bursts: [], wrongFlash: null }, PANEL_LEFT_X, false, now);
    drawPanel(g, { ...game, found: [], hintReveal: null, bursts: [], wrongFlash: null }, PANEL_RIGHT_X, true, now);
    drawTitle(g, game);
  } else {
    drawPanel(g, game, PANEL_LEFT_X, false, now);
    drawPanel(g, game, PANEL_RIGHT_X, true, now);
    drawFloaters(g, game, now);
    if (game.screen === SCREEN_LEVEL_DONE) drawLevelDone(g, game);
    if (game.screen === SCREEN_GAME_OVER) drawGameOver(g, game);
    if (game.screen === SCREEN_VICTORY) drawVictory(g, game);
    if (game.paused && game.screen === SCREEN_PLAY) {
      overlay(g, 0.5);
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      g.font = 'bold 44px system-ui, sans-serif';
      g.fillText('PAUSED', 640, 380);
      g.font = '20px system-ui, sans-serif';
      g.fillText('Press P to keep hunting', 640, 420);
    }
  }
  drawFooter(g, game, now);
}
