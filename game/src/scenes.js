// The three original scenes of Odd Twin, drawn in code — no images, no assets.
// Each scene has one draw function that paints the LEFT panel, then paints the
// RIGHT panel with its differences applied, and a DIFFS list: the clickable
// circle (x, y, r) of every difference, in panel coordinates (560 x 520).
// A difference is fair when its circle sits exactly on the changed drawing.
import { scatter } from './random.js';
import { NEW_SCENES } from './scenes2.js';

// --- small drawing helpers (panel-local coordinates) ---
function circle(g, x, y, r, fill) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fillStyle = fill;
  g.fill();
}
function ellipse(g, x, y, rx, ry, fill) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fillStyle = fill;
  g.fill();
}
function rect(g, x, y, w, h, fill) {
  g.fillStyle = fill;
  g.fillRect(x, y, w, h);
}
function poly(g, pts, fill) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
  g.fillStyle = fill;
  g.fill();
}
function cloud(g, x, y, s, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.arc(x, y, 20 * s, 0, Math.PI * 2);
  g.arc(x + 22 * s, y + 4 * s, 16 * s, 0, Math.PI * 2);
  g.arc(x - 22 * s, y + 5 * s, 15 * s, 0, Math.PI * 2);
  g.fill();
}
function flower(g, x, y, petal, centre) {
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    circle(g, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 7, petal);
  }
  circle(g, x, y, 6, centre);
}

// ---------------------------------------------------------------------------
// LEVEL 1 — Sunny Park. Differences:
// 1 sun sunglasses · 2 extra cloud · 3 bird missing · 4 flower colour
// 5 butterfly missing · 6 bag on the bench · 7 duck missing
// ---------------------------------------------------------------------------
export const PARK_DIFFS = [
  { x: 112, y: 82, r: 32, label: 'the sun wears sunglasses' },
  { x: 186, y: 142, r: 30, label: 'an extra cloud' },
  { x: 478, y: 118, r: 22, label: 'the bird is gone' },
  { x: 92, y: 468, r: 22, label: 'a flower changed colour' },
  { x: 300, y: 332, r: 24, label: 'the butterfly is gone' },
  { x: 452, y: 296, r: 28, label: 'a bag appeared on the bench' },
  { x: 402, y: 428, r: 24, label: 'the duck is gone' },
];

function drawPark(g, right) {
  // Sky, hills, path.
  const sky = g.createLinearGradient(0, 0, 0, 520);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(1, '#dff3ff');
  rect(g, 0, 0, 560, 520, sky);
  ellipse(g, 110, 430, 340, 150, '#8fce6e');
  ellipse(g, 480, 450, 300, 140, '#79c25f');
  g.fillStyle = '#e8d29a';
  g.beginPath();
  g.moveTo(250, 520);
  g.quadraticCurveTo(280, 380, 300, 300);
  g.quadraticCurveTo(310, 260, 300, 230);
  g.lineTo(340, 230);
  g.quadraticCurveTo(350, 300, 330, 380);
  g.quadraticCurveTo(320, 460, 330, 520);
  g.closePath();
  g.fill();
  // Sun (with sunglasses on the right).
  circle(g, 112, 82, 38, '#ffd93b');
  g.strokeStyle = '#f4a900';
  g.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    g.beginPath();
    g.moveTo(112 + Math.cos(a) * 46, 82 + Math.sin(a) * 46);
    g.lineTo(112 + Math.cos(a) * 58, 82 + Math.sin(a) * 58);
    g.stroke();
  }
  if (right) {
    rect(g, 92, 72, 18, 12, '#20242e');
    rect(g, 114, 72, 18, 12, '#20242e');
    g.strokeStyle = '#20242e';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(110, 78);
    g.lineTo(114, 78);
    g.stroke();
  } else {
    circle(g, 102, 78, 3, '#20242e');
    circle(g, 122, 78, 3, '#20242e');
    g.strokeStyle = '#20242e';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(112, 88, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  }
  // Clouds (an extra one on the right).
  cloud(g, 300, 72, 1, '#ffffff');
  cloud(g, 462, 58, 0.8, '#ffffff');
  if (right) cloud(g, 186, 142, 0.9, '#ffffff');
  // Bird (missing on the right).
  if (!right) {
    g.strokeStyle = '#20242e';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(468, 118, 9, Math.PI * 1.15, Math.PI * 1.85);
    g.arc(488, 118, 9, Math.PI * 1.15, Math.PI * 1.85);
    g.stroke();
  }
  // Big tree.
  rect(g, 138, 300, 22, 110, '#8b5e3c');
  circle(g, 120, 280, 42, '#3f9d4e');
  circle(g, 180, 275, 40, '#4cb45c');
  circle(g, 150, 235, 44, '#57c465');
  circle(g, 128, 262, 10, '#e63946');
  circle(g, 172, 250, 10, '#e63946');
  // Bench (with a bag on the right).
  rect(g, 420, 300, 70, 10, '#a9713f');
  rect(g, 420, 322, 70, 10, '#a9713f');
  rect(g, 428, 332, 8, 34, '#7a4a21');
  rect(g, 474, 332, 8, 34, '#7a4a21');
  if (right) {
    rect(g, 438, 272, 34, 28, '#e63946');
    g.strokeStyle = '#7a1622';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(455, 272, 9, Math.PI, 0);
    g.stroke();
  }
  // Butterfly (missing on the right).
  if (!right) {
    ellipse(g, 290, 332, 12, 18, '#b388ff');
    ellipse(g, 312, 332, 12, 18, '#7c5cff');
    g.strokeStyle = '#20242e';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(301, 322);
    g.lineTo(301, 342);
    g.stroke();
  }
  // Pond and duck (duck missing on the right).
  ellipse(g, 420, 440, 95, 34, '#4aa8dd');
  ellipse(g, 420, 440, 95, 34, 'rgba(255,255,255,0.15)');
  g.strokeStyle = '#2f7fb8';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(350, 436);
  g.quadraticCurveTo(380, 430, 410, 436);
  g.moveTo(440, 448);
  g.quadraticCurveTo(470, 442, 495, 448);
  g.stroke();
  if (!right) {
    ellipse(g, 402, 428, 16, 11, '#ffffff');
    circle(g, 414, 418, 8, '#ffffff');
    poly(g, [[420, 416], [430, 419], [420, 422]], '#fb8500');
    circle(g, 416, 416, 1.8, '#20242e');
  }
  // Flowers along the bottom (one changes colour on the right).
  const spots = [40, 92, 150, 210, 500, 540];
  spots.forEach((x, i) => {
    const petal = x === 92 && right ? '#9b5de5' : ['#ff5d8f', '#ff8fa3', '#ffd93b', '#ff5d8f', '#ff8fa3', '#ffd93b'][i];
    flower(g, x, 468, petal, '#fb8500');
  });
  g.strokeStyle = '#2f7d32';
  g.lineWidth = 3;
  spots.forEach((x) => {
    g.beginPath();
    g.moveTo(x, 476);
    g.lineTo(x, 500);
    g.stroke();
  });
}

// ---------------------------------------------------------------------------
// LEVEL 2 — Cozy Café. Differences:
// 1 sun becomes moon in the window · 2 menu price 5 becomes 8 · 3 cup blue/yellow
// 4 lamp glow off · 5 cat tail up · 6 flower on the plant · 7 cherry missing
// ---------------------------------------------------------------------------
export const CAFE_DIFFS = [
  { x: 172, y: 152, r: 28, label: 'the sun became the moon' },
  { x: 468, y: 172, r: 18, label: 'a menu price changed' },
  { x: 392, y: 272, r: 20, label: 'a cup changed colour' },
  { x: 282, y: 122, r: 28, label: 'the lamp went out' },
  { x: 152, y: 382, r: 24, label: 'the cat raised its tail' },
  { x: 482, y: 358, r: 20, label: 'a flower bloomed on the plant' },
  { x: 332, y: 402, r: 18, label: 'the cherry is gone' },
];

function drawCafe(g, right) {
  // Wall, floor, skirting.
  rect(g, 0, 0, 560, 420, '#f7e3c3');
  rect(g, 0, 420, 560, 100, '#b07d4f');
  g.strokeStyle = 'rgba(122,74,33,0.5)';
  g.lineWidth = 2;
  for (let x = 0; x < 560; x += 46) {
    g.beginPath();
    g.moveTo(x, 420);
    g.lineTo(x + 20, 520);
    g.stroke();
  }
  rect(g, 0, 412, 560, 8, '#8a5a2b');
  // Window with sky (sun left, moon right).
  rect(g, 78, 66, 190, 170, '#20242e');
  rect(g, 86, 74, 174, 154, right ? '#1d2b53' : '#aee3ff');
  if (right) {
    circle(g, 172, 152, 26, '#f4f1de');
    circle(g, 162, 144, 8, '#d8d3b8');
    circle(g, 180, 160, 6, '#d8d3b8');
    circle(g, 226, 106, 3, '#ffffff');
    circle(g, 120, 100, 2.5, '#ffffff');
    circle(g, 210, 190, 2.5, '#ffffff');
  } else {
    circle(g, 172, 152, 26, '#ffd93b');
    circle(g, 130, 200, 14, '#ffffff');
    circle(g, 226, 200, 12, '#ffffff');
    poly(g, [[120, 228], [150, 170], [180, 228]], '#7a9e7e');
    poly(g, [[190, 228], [220, 180], [250, 228]], '#5d8a68');
  }
  g.strokeStyle = '#20242e';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(173, 74);
  g.lineTo(173, 228);
  g.moveTo(86, 151);
  g.lineTo(260, 151);
  g.stroke();
  // Menu board (one price changes on the right).
  rect(g, 368, 82, 160, 130, '#2b2118');
  rect(g, 376, 90, 144, 114, '#fff8ec');
  g.fillStyle = '#2b2118';
  g.font = 'bold 20px Georgia, serif';
  g.textAlign = 'center';
  g.fillText('MENU', 448, 116);
  g.font = '15px Georgia, serif';
  g.textAlign = 'left';
  g.fillText('Latte', 388, 142);
  g.fillText('Cake', 388, 168);
  g.fillText('Tea', 388, 194);
  g.textAlign = 'right';
  g.fillText('4', 508, 142);
  g.fillText(right ? '8' : '5', 508, 168);
  g.fillText('3', 508, 194);
  // Shelf with three cups (middle cup changes colour on the right).
  rect(g, 300, 292, 220, 10, '#8a5a2b');
  const cups = [
    { x: 340, c: '#e63946' },
    { x: 392, c: right ? '#ffd93b' : '#4361ee' },
    { x: 444, c: '#2a9d8f' },
  ];
  cups.forEach((cup) => {
    rect(g, cup.x - 16, 258, 32, 34, cup.c);
    g.strokeStyle = '#20242e';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(cup.x + 18, 272, 8, -Math.PI / 2, Math.PI / 2);
    g.stroke();
  });
  // Hanging lamp (glow off on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(282, 0);
  g.lineTo(282, 84);
  g.stroke();
  if (!right) {
    const glow = g.createRadialGradient(282, 122, 6, 282, 122, 70);
    glow.addColorStop(0, 'rgba(255,214,64,0.55)');
    glow.addColorStop(1, 'rgba(255,214,64,0)');
    g.fillStyle = glow;
    g.fillRect(212, 52, 140, 140);
  }
  poly(g, [[262, 84], [302, 84], [292, 122], [272, 122]], right ? '#6c757d' : '#fb8500');
  circle(g, 282, 126, 8, right ? '#adb5bd' : '#ffe066');
  // Counter.
  rect(g, 280, 380, 260, 40, '#8a5a2b');
  rect(g, 280, 380, 260, 8, '#a9713f');
  // Cake with cherry (cherry missing on the right).
  ellipse(g, 332, 424, 34, 10, '#ffffff');
  rect(g, 306, 396, 52, 28, '#ff8fa3');
  rect(g, 306, 396, 52, 10, '#ffffff');
  if (!right) {
    circle(g, 332, 396, 7, '#e63946');
    g.strokeStyle = '#2a9d8f';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(332, 390);
    g.quadraticCurveTo(338, 382, 344, 384);
    g.stroke();
  }
  // Plant (a flower blooms on the right).
  rect(g, 468, 372, 30, 34, '#e63946');
  g.strokeStyle = '#2a9d8f';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(483, 372);
  g.lineTo(483, 330);
  g.moveTo(483, 352);
  g.quadraticCurveTo(462, 340, 458, 322);
  g.moveTo(483, 352);
  g.quadraticCurveTo(504, 340, 508, 322);
  g.stroke();
  if (right) flower(g, 483, 322, '#ff5d8f', '#ffd93b');
  // Cat on the chair (tail up on the right).
  rect(g, 60, 430, 120, 14, '#a9713f');
  rect(g, 68, 444, 10, 50, '#7a4a21');
  rect(g, 162, 444, 10, 50, '#7a4a21');
  ellipse(g, 120, 408, 46, 30, '#f4a261');
  circle(g, 152, 372, 22, '#f4a261');
  poly(g, [[136, 356], [142, 334], [152, 354]], '#f4a261');
  poly(g, [[158, 354], [168, 334], [172, 356]], '#f4a261');
  circle(g, 158, 368, 2.5, '#20242e');
  g.strokeStyle = '#f4a261';
  g.lineWidth = 7;
  g.lineCap = 'round';
  g.beginPath();
  if (right) {
    g.moveTo(78, 410);
    g.quadraticCurveTo(64, 372, 82, 352);
  } else {
    g.moveTo(78, 414);
    g.quadraticCurveTo(52, 420, 46, 398);
  }
  g.stroke();
  g.lineCap = 'butt';
  // Framed picture on the wall.
  rect(g, 300, 120, 46, 60, '#8a5a2b');
  rect(g, 306, 126, 34, 48, '#aee3ff');
  circle(g, 323, 142, 8, '#ffd93b');
  poly(g, [[308, 174], [323, 150], [338, 174]], '#2a9d8f');
}

// ---------------------------------------------------------------------------
// LEVEL 3 — Moonlit Harbour. Differences:
// 1 star missing · 2 lighthouse beam flips · 3 sail white/red · 4 extra crate
// 5 seagull missing · 6 flag flips · 7 harbour window dark · 8 buoy red/yellow
// ---------------------------------------------------------------------------
export const HARBOUR_DIFFS = [
  { x: 122, y: 72, r: 20, label: 'a star went out' },
  { x: 208, y: 182, r: 30, label: 'the lighthouse beam flipped' },
  { x: 302, y: 332, r: 28, label: 'the sail changed colour' },
  { x: 472, y: 402, r: 24, label: 'an extra crate on the pier' },
  { x: 252, y: 122, r: 22, label: 'the seagull is gone' },
  { x: 96, y: 152, r: 20, label: 'the flag points the other way' },
  { x: 362, y: 222, r: 18, label: 'a harbour window went dark' },
  { x: 202, y: 452, r: 20, label: 'the buoy changed colour' },
];

const HARBOUR_STARS = scatter(7, 26, 20, 16, 540, 200, 26);

function drawHarbour(g, right) {
  // Night sky and sea.
  const sky = g.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0d1b3d');
  sky.addColorStop(1, '#274472');
  rect(g, 0, 0, 560, 300, sky);
  rect(g, 0, 300, 560, 220, '#123a5c');
  g.strokeStyle = 'rgba(255,255,255,0.25)';
  g.lineWidth = 2;
  for (let y = 330; y < 510; y += 34) {
    for (let x = 20 + ((y / 34) % 2) * 40; x < 540; x += 90) {
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + 16, y - 6, x + 34, y);
      g.stroke();
    }
  }
  // Stars (one goes out on the right).
  HARBOUR_STARS.forEach((s, i) => {
    if (right && i === 3) return;
    circle(g, s.x, s.y, i % 3 === 0 ? 3 : 2, '#ffffff');
  });
  // Moon and its reflection.
  circle(g, 452, 82, 34, '#f4f1de');
  circle(g, 440, 74, 8, '#d8d3b8');
  circle(g, 462, 92, 6, '#d8d3b8');
  g.fillStyle = 'rgba(244,241,222,0.35)';
  for (let i = 0; i < 5; i += 1) g.fillRect(438 + (i % 2) * 14, 320 + i * 34, 30 - i * 3, 7);
  // Seagull (missing on the right).
  if (!right) {
    g.strokeStyle = '#ffffff';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(242, 122, 9, Math.PI * 1.15, Math.PI * 1.85);
    g.arc(262, 122, 9, Math.PI * 1.15, Math.PI * 1.85);
    g.stroke();
  }
  // Lighthouse (beam flips direction on the right; flag flips too).
  rect(g, 74, 170, 34, 150, '#f8f9fa');
  rect(g, 74, 200, 34, 16, '#e63946');
  rect(g, 74, 244, 34, 16, '#e63946');
  rect(g, 74, 288, 34, 16, '#e63946');
  rect(g, 68, 148, 46, 24, '#20242e');
  circle(g, 91, 160, 8, '#ffe066');
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(91, 148);
  g.lineTo(91, 128);
  g.stroke();
  if (right) {
    poly(g, [[91, 128], [91, 144], [62, 144]], '#e63946');
  } else {
    poly(g, [[91, 128], [91, 144], [120, 144]], '#e63946');
  }
  // Beam.
  g.fillStyle = 'rgba(255,224,102,0.35)';
  if (right) {
    poly(g, [[72, 158], [72, 172], [8, 210], [8, 120]]);
  } else {
    poly(g, [[110, 158], [110, 172], [300, 214], [300, 116]]);
  }
  // Harbour building with lit windows (one goes dark on the right).
  rect(g, 330, 180, 130, 120, '#5c4a6b');
  poly(g, [[322, 180], [395, 128], [468, 180]], '#3d2f4a');
  [352, 392, 432].forEach((x, i) => {
    const dark = right && i === 0;
    rect(g, x, 212, 22, 26, dark ? '#1d2b53' : '#ffe066');
    g.strokeStyle = '#20242e';
    g.lineWidth = 2;
    g.strokeRect(x, 212, 22, 26);
  });
  rect(g, 384, 258, 24, 42, '#2b2118');
  // Sailboat (sail changes colour on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(302, 300);
  g.lineTo(302, 392);
  g.stroke();
  poly(g, [[302, 306], [302, 380], [352, 380]], right ? '#e63946' : '#f8f9fa');
  poly(g, [[298, 316], [298, 380], [262, 380]], '#f8f9fa');
  ellipse(g, 306, 392, 62, 12, '#8b5e3c');
  // Buoy (changes colour on the right).
  circle(g, 202, 452, 12, right ? '#ffd93b' : '#e63946');
  rect(g, 198, 432, 8, 10, '#20242e');
  // Pier and crates (an extra crate on the right).
  rect(g, 420, 400, 140, 18, '#8a5a2b');
  rect(g, 428, 418, 10, 60, '#7a4a21');
  rect(g, 520, 418, 10, 60, '#7a4a21');
  rect(g, 440, 366, 34, 34, '#b07d4f');
  g.strokeStyle = '#7a4a21';
  g.lineWidth = 2;
  g.strokeRect(440, 366, 34, 34);
  g.beginPath();
  g.moveTo(440, 366);
  g.lineTo(474, 400);
  g.moveTo(474, 366);
  g.lineTo(440, 400);
  g.stroke();
  if (right) {
    rect(g, 482, 372, 28, 28, '#2a9d8f');
    g.strokeRect(482, 372, 28, 28);
  }
  // Rope coil on the pier.
  g.strokeStyle = '#d9c08a';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(530, 392, 10, 0, Math.PI * 2);
  g.stroke();
}

// --- public scene table: draw + diffs, in level order ---
export const SCENES = [
  { draw: drawPark, diffs: PARK_DIFFS },
  { draw: drawCafe, diffs: CAFE_DIFFS },
  { draw: drawHarbour, diffs: HARBOUR_DIFFS },
  ...NEW_SCENES,
];
