// Game state: screens, levels, scoring, timer, hints and found marks.
// One job: the rules of Odd Twin — what a click does, what a find is worth,
// when a level ends — with no drawing and no input in here.
import {
  LEVELS,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  HINTS_PER_LEVEL,
  HINT_COOLDOWN_MS,
  HINT_REVEAL_MS,
  WRONG_TIME_PENALTY_S,
  WRONG_SCORE_PENALTY,
  FIND_BASE_SCORE,
  HINT_SCORE_COST,
  LEVEL_TIME_BONUS_PER_SECOND,
} from './config.js';
import { SCENES } from './scenes.js';
import { playFound, playWrong, playWin, playHint, playTick } from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'levelDone';
export const SCREEN_GAME_OVER = 'gameOver';
export const SCREEN_VICTORY = 'victory';

/** Fresh state for one whole run (all six levels). */
export function createGame() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: [], // indexes into the level's diffs, in find order
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeftMs: LEVELS[0].seconds * 1000,
    hintsLeft: HINTS_PER_LEVEL,
    hintCooldownUntil: 0,
    hintReveal: null, // { diffIndex, until }
    wrongFlash: null, // { x, y, panel, until }
    floaters: [], // { x, y, text, until, color }
    bursts: [], // { x, y, panel, born, color }
    misses: 0,
    finds: 0,
    levelStartScore: 0,
    levelTimeBonus: 0,
    stars: 0,
    paused: false,
    lastTickSecond: -1,
    message: 'Find every difference — click it in either picture.',
    frozen: false, // screenshot staging: the timer never runs
    lens: true, // magnifier enabled (L toggles it)
    lensPos: null, // { cx, cy, panel, x, y } — pointer in canvas coords + panel-local
    cursor: { panel: 'left', x: 280, y: 260 }, // keyboard cursor, panel-local
    cursorVisible: false, // appears on the first arrow-key press
  };
}

export function levelDiffs(game) {
  return SCENES[game.levelIndex].diffs;
}

export function foundCount(game) {
  return game.found.length;
}

export function remainingCount(game) {
  return levelDiffs(game).length - game.found.length;
}

export function startLevel(game, index) {
  game.levelIndex = index;
  game.screen = SCREEN_PLAY;
  game.found = [];
  game.combo = 0;
  game.timeLeftMs = LEVELS[index].seconds * 1000;
  game.hintsLeft = HINTS_PER_LEVEL;
  game.hintCooldownUntil = 0;
  game.hintReveal = null;
  game.wrongFlash = null;
  game.floaters = [];
  game.bursts = [];
  game.paused = false;
  game.lastTickSecond = -1;
  game.levelStartScore = game.score;
  game.levelTimeBonus = 0;
  game.stars = 0;
  game.cursor = { panel: 'left', x: 280, y: 260 };
  game.cursorVisible = false;
  game.lensPos = null;
  game.message = `Level ${index + 1}: ${LEVELS[index].name} — ${LEVELS[index].diffs} differences to find.`;
}

export function startGame(game) {
  game.score = 0;
  game.misses = 0;
  game.finds = 0;
  game.bestCombo = 0;
  startLevel(game, 0);
}

/** Advance the clock; returns 'timeout' when the level runs out of time. */
export function tick(game, dtMs, now) {
  if (game.screen !== SCREEN_PLAY || game.paused || game.frozen) return null;
  game.timeLeftMs -= dtMs;
  const seconds = Math.ceil(game.timeLeftMs / 1000);
  if (seconds <= 10 && seconds !== game.lastTickSecond && seconds > 0) {
    game.lastTickSecond = seconds;
    playTick();
  }
  if (game.timeLeftMs <= 0) {
    game.timeLeftMs = 0;
    game.screen = SCREEN_GAME_OVER;
    game.message = 'Time ran out! The differences got away this time.';
    return 'timeout';
  }
  return null;
}

/** Try a click at panel-local (x, y) on either panel. Returns 'found' | 'miss' | 'done'. */
export function clickAt(game, x, y, now) {
  if (game.screen !== SCREEN_PLAY || game.paused) return 'none';
  const diffs = levelDiffs(game);
  for (let i = 0; i < diffs.length; i += 1) {
    if (game.found.includes(i)) continue;
    const d = diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      game.found.push(i);
      game.finds += 1;
      game.combo += 1;
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      const gained = FIND_BASE_SCORE * game.combo;
      game.score += gained;
      game.floaters.push({
        x: d.x,
        y: d.y - d.r - 6,
        text: `+${gained}`,
        until: now + 1100,
        color: '#2a9d8f',
      });
      game.bursts.push({ x: d.x, y: d.y, born: now, color: '#ffb703' });
      playFound();
      if (game.found.length === diffs.length) {
        const bonus = Math.floor(game.timeLeftMs / 1000) * LEVEL_TIME_BONUS_PER_SECOND;
        game.levelTimeBonus = bonus;
        game.score += bonus;
        const misses = game.misses;
        game.stars = misses === 0 ? 3 : misses <= 2 ? 2 : 1;
        playWin();
        game.screen = game.levelIndex === LEVELS.length - 1 ? SCREEN_VICTORY : SCREEN_LEVEL_DONE;
        game.message =
          game.screen === SCREEN_VICTORY
            ? 'You found them all — every twin matched!'
            : `Level clear! Time bonus +${bonus}.`;
        return 'done';
      }
      game.message = `Found it — ${diffs[i].label}! ${remainingCount(game)} to go.`;
      return 'found';
    }
  }
  // A miss: small score and time penalty, combo resets.
  game.misses += 1;
  game.combo = 0;
  game.score = Math.max(0, game.score - WRONG_SCORE_PENALTY);
  game.timeLeftMs = Math.max(0, game.timeLeftMs - WRONG_TIME_PENALTY_S * 1000);
  game.wrongFlash = { x, y, until: now + 600 };
  game.floaters.push({ x, y, text: `-${WRONG_SCORE_PENALTY} · -${WRONG_TIME_PENALTY_S}s`, until: now + 900, color: '#e63946' });
  playWrong();
  game.message = 'Not quite — that spot matches. Look closer!';
  return 'miss';
}

/** Spend a hint: briefly ring a random unfound difference on both panels. */
export function useHint(game, now) {
  if (game.screen !== SCREEN_PLAY || game.paused) return false;
  if (game.hintsLeft <= 0) {
    game.message = 'No hints left on this level.';
    return false;
  }
  if (now < game.hintCooldownUntil) {
    game.message = 'Hint recharging — give it a moment.';
    return false;
  }
  const remaining = levelDiffs(game)
    .map((d, i) => i)
    .filter((i) => !game.found.includes(i));
  if (remaining.length === 0) return false;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_SCORE_COST);
  game.hintReveal = { diffIndex: pick, until: now + HINT_REVEAL_MS };
  game.hintCooldownUntil = now + HINT_COOLDOWN_MS;
  playHint();
  game.message = `Hint: something is off near there… (-${HINT_SCORE_COST} pts)`;
  return true;
}

export function nextLevel(game) {
  if (game.levelIndex + 1 < LEVELS.length) startLevel(game, game.levelIndex + 1);
}

export function togglePause(game) {
  if (game.screen !== SCREEN_PLAY) return;
  game.paused = !game.paused;
  game.message = game.paused ? 'Paused — press P to keep hunting.' : 'Back to the hunt!';
}

export function toTitle(game) {
  game.screen = SCREEN_TITLE;
  game.paused = false;
}

/** Move the keyboard cursor by (dx, dy) panel pixels; it crosses panels at the edges. */
export function moveCursor(game, dx, dy) {
  if (game.screen !== SCREEN_PLAY || game.paused) return;
  game.cursorVisible = true;
  let { panel, x, y } = game.cursor;
  x += dx;
  y += dy;
  if (x > PANEL_WIDTH && panel === 'left') {
    panel = 'right';
    x -= PANEL_WIDTH;
  }
  if (x < 0 && panel === 'right') {
    panel = 'left';
    x += PANEL_WIDTH;
  }
  x = Math.max(0, Math.min(PANEL_WIDTH, x));
  y = Math.max(0, Math.min(PANEL_HEIGHT, y));
  game.cursor = { panel, x, y };
}

/** Mark the spot under the keyboard cursor (same as a click there). */
export function markCursor(game, now) {
  if (game.screen !== SCREEN_PLAY || game.paused) return 'none';
  game.cursorVisible = true;
  return clickAt(game, game.cursor.x, game.cursor.y, now);
}

/** Toggle the magnifier lens on/off. */
export function toggleLens(game) {
  game.lens = !game.lens;
  game.message = game.lens
    ? 'Magnifier on — hover a picture to zoom in.'
    : 'Magnifier off — press L to bring it back.';
}
