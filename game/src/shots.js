// Deterministic screenshot scenes behind ?shot=start|play|end.
// Each one sets the real game state to a fixed frame — the play shot has three
// differences already found (rings + checks on both panels), four still hidden,
// and the counter reading FOUND 3 / 7 · 4 TO GO — then freezes the timer so
// the frame never changes while the screenshot is taken.
import { SCREEN_TITLE, SCREEN_LEVEL_DONE, startLevel, createGame } from './game.js';

/** Set `game` to the named scene and return it. Any other name is the title. */
export function stageShot(name, game) {
  if (name === 'play') {
    startLevel(game, 0);
    game.found = [0, 1, 2];
    game.finds = 3;
    game.combo = 3;
    game.bestCombo = 3;
    game.score = 600;
    game.timeLeftMs = 151000;
    game.misses = 0;
    game.message = 'Found it — the bird is gone! 4 to go.';
    game.frozen = true;
    return game;
  }
  if (name === 'end') {
    startLevel(game, 0);
    game.found = [0, 1, 2, 3, 4, 5, 6];
    game.finds = 7;
    game.combo = 7;
    game.bestCombo = 7;
    game.score = 3220;
    game.levelTimeBonus = 420;
    game.stars = 3;
    game.timeLeftMs = 42000;
    game.screen = SCREEN_LEVEL_DONE;
    game.message = 'Level clear! Time bonus +420.';
    game.frozen = true;
    return game;
  }
  const fresh = createGame();
  fresh.screen = SCREEN_TITLE;
  fresh.frozen = true;
  return fresh;
}
