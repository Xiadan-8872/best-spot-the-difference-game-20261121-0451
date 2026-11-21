// Shared constants for Odd Twin: canvas size, panel geometry, timing and scoring.
// One job: every number the rest of the game agrees on lives here.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const HEADER_HEIGHT = 92;
export const FOOTER_TOP = 648;

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 520;
export const PANEL_Y = 112;
export const PANEL_LEFT_X = 40;
export const PANEL_RIGHT_X = 680;

export const LEVELS = [
  { id: 0, name: 'Sunny Park', tag: 'Easy · 7 differences', seconds: 180, diffs: 7 },
  { id: 1, name: 'Cozy Café', tag: 'Medium · 7 differences', seconds: 150, diffs: 7 },
  { id: 2, name: 'Moonlit Harbour', tag: 'Hard · 8 differences', seconds: 120, diffs: 8 },
  { id: 3, name: 'Rainy Rooftop', tag: 'Medium · 9 differences', seconds: 180, diffs: 9 },
  { id: 4, name: 'Starry Campsite', tag: 'Hard · 9 differences', seconds: 165, diffs: 9 },
  { id: 5, name: 'Busy Bakery', tag: 'Expert · 10 differences', seconds: 150, diffs: 10 },
];

// Magnifier (lens): radius on screen, zoom factor, toggle key.
export const LENS_RADIUS = 72;
export const LENS_ZOOM = 2;

// Keyboard cursor: step in panel pixels per arrow press (Shift = fine step).
export const CURSOR_STEP = 14;
export const CURSOR_FINE_STEP = 4;
// Touch: how far above the fingertip the lens sits, so the finger never covers it.
export const LENS_TOUCH_LIFT = 90;

export const HINTS_PER_LEVEL = 3;
export const HINT_COOLDOWN_MS = 10000;
export const HINT_REVEAL_MS = 4000;
export const WRONG_TIME_PENALTY_S = 2;
export const WRONG_SCORE_PENALTY = 25;
export const FIND_BASE_SCORE = 100;
export const HINT_SCORE_COST = 50;
export const LEVEL_TIME_BONUS_PER_SECOND = 10;

export const COLORS = {
  ink: '#20242e',
  paper: '#fff8ec',
  panelBorder: '#20242e',
  headerBg: '#20242e',
  accent: '#ffb703',
  accentDark: '#fb8500',
  good: '#2a9d8f',
  bad: '#e63946',
  foundRing: '#2a9d8f',
  hintRing: '#ffb703',
};
