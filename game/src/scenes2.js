// Three new scenes for Odd Twin (levels 4-6), drawn in code — no images, no assets.
// Same contract as scenes.js: each scene has one draw function that paints the
// LEFT panel, then paints the RIGHT panel with its differences applied, and a
// DIFFS list: the clickable circle (x, y, r) of every difference, in panel
// coordinates (560 x 520). A difference is fair when its circle sits exactly
// on the changed drawing.

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

// Rain streak start points (fixed, identical on both panels).
const RAIN = [
  [40, 30], [120, 60], [200, 25], [280, 70], [360, 40], [440, 75], [520, 35],
  [80, 150], [160, 180], [240, 140], [320, 175], [400, 150], [480, 185], [540, 160],
  [60, 280], [150, 320], [230, 290], [330, 330], [420, 300], [510, 340],
  [100, 430], [200, 460], [300, 440], [400, 470], [500, 450],
];

// ---------------------------------------------------------------------------
// LEVEL 4 — Rainy Rooftop. Differences:
// 1 umbrella colour · 2 cat missing · 3 chimney smoke missing · 4 window lit
// 5 shirt missing · 6 flower colour · 7 antenna flips · 8 puddle ripple
// 9 bird missing
// ---------------------------------------------------------------------------
export const ROOFTOP_DIFFS = [
  { x: 150, y: 372, r: 26, label: 'the umbrella changed colour' },
  { x: 300, y: 395, r: 28, label: 'the cat is gone' },
  { x: 470, y: 218, r: 30, label: 'the chimney smoke is gone' },
  { x: 112, y: 279, r: 18, label: 'a window lit up' },
  { x: 324, y: 283, r: 22, label: 'a shirt vanished from the line' },
  { x: 420, y: 380, r: 18, label: 'the flower changed colour' },
  { x: 500, y: 170, r: 20, label: 'the antenna turned around' },
  { x: 250, y: 465, r: 24, label: 'a ripple appeared in the puddle' },
  { x: 320, y: 104, r: 20, label: 'the bird flew off the wire' },
];

function drawRooftop(g, right) {
  // Dusk sky.
  const sky = g.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#2b3a67');
  sky.addColorStop(1, '#8a9bb8');
  rect(g, 0, 0, 560, 340, sky);
  // Wire + bird (bird missing on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(0, 108);
  g.quadraticCurveTo(280, 118, 560, 108);
  g.stroke();
  if (!right) {
    ellipse(g, 320, 104, 12, 8, '#20242e');
    circle(g, 330, 98, 6, '#20242e');
    poly(g, [[336, 97], [342, 99], [336, 101]], '#fb8500');
    circle(g, 332, 96, 1.5, '#ffffff');
  }
  // Skyline: three buildings with windows (one window lights up on the right).
  // Building 1 (x 20-140, y 210-340). Diff window: col 2, row 1 -> (105, 270).
  rect(g, 20, 210, 120, 130, '#3a4a6b');
  for (let c = 0; c < 3; c += 1) {
    for (let r = 0; r < 3; r += 1) {
      const wx = 35 + c * 35;
      const wy = 230 + r * 40;
      const isDiff = c === 2 && r === 1;
      const lit = isDiff ? right : ((c + r) % 2 === 0);
      rect(g, wx, wy, 14, 18, lit ? '#ffd93b' : '#1d2b53');
    }
  }
  // Building 2 (x 160-300, y 160-340).
  rect(g, 160, 160, 140, 180, '#2f3f5e');
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      const wx = 175 + c * 30;
      const wy = 180 + r * 36;
      rect(g, wx, wy, 14, 18, (c * 2 + r) % 3 === 0 ? '#ffd93b' : '#1d2b53');
    }
  }
  // Building 3 (x 320-540, y 200-340).
  rect(g, 320, 200, 220, 140, '#3a4a6b');
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 3; r += 1) {
      const wx = 340 + c * 50;
      const wy = 220 + r * 36;
      rect(g, wx, wy, 16, 18, (c + r * 2) % 3 === 0 ? '#ffd93b' : '#1d2b53');
    }
  }
  // Antenna on building 3 (dish flips on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(500, 200);
  g.lineTo(500, 165);
  g.stroke();
  if (right) poly(g, [[500, 165], [500, 178], [518, 178]], '#e63946');
  else poly(g, [[500, 165], [500, 178], [482, 178]], '#e63946');
  // Roof floor + parapet.
  rect(g, 0, 340, 560, 180, '#7d7468');
  rect(g, 0, 340, 560, 14, '#5d5348');
  // Water tank (left).
  rect(g, 60, 255, 70, 85, '#b08968');
  ellipse(g, 95, 255, 35, 10, '#8a6a4a');
  rect(g, 85, 245, 20, 10, '#8a6a4a');
  g.strokeStyle = '#8a6a4a';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(60, 285);
  g.lineTo(130, 285);
  g.moveTo(60, 315);
  g.lineTo(130, 315);
  g.stroke();
  // Umbrella leaning on the tank (colour changes on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(150, 375);
  g.lineTo(150, 425);
  g.stroke();
  g.fillStyle = right ? '#4361ee' : '#e63946';
  g.beginPath();
  g.arc(150, 375, 28, Math.PI, 0);
  g.closePath();
  g.fill();
  // Chimney + smoke (smoke missing on the right).
  rect(g, 455, 255, 30, 85, '#9c6644');
  rect(g, 450, 248, 40, 10, '#7a4a21');
  if (!right) {
    circle(g, 470, 235, 10, 'rgba(255,255,255,0.7)');
    circle(g, 478, 215, 12, 'rgba(255,255,255,0.7)');
    circle(g, 468, 195, 9, 'rgba(255,255,255,0.7)');
  }
  // Clothesline with two shirts (one missing on the right).
  g.strokeStyle = '#5d5348';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(170, 340);
  g.lineTo(170, 268);
  g.moveTo(390, 340);
  g.lineTo(390, 268);
  g.stroke();
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(170, 268);
  g.lineTo(390, 268);
  g.stroke();
  // Shirt 1 (stays).
  rect(g, 200, 268, 28, 30, '#ff8fa3');
  rect(g, 192, 270, 10, 12, '#ff8fa3');
  rect(g, 226, 270, 10, 12, '#ff8fa3');
  // Shirt 2 (missing on the right).
  if (!right) {
    rect(g, 310, 268, 28, 30, '#4361ee');
    rect(g, 302, 270, 10, 12, '#4361ee');
    rect(g, 336, 270, 10, 12, '#4361ee');
  }
  // Cat sitting on the roof (missing on the right).
  if (!right) {
    ellipse(g, 300, 400, 26, 18, '#f4a261');
    circle(g, 300, 378, 14, '#f4a261');
    poly(g, [[288, 368], [292, 352], [300, 366]], '#f4a261');
    poly(g, [[304, 366], [312, 352], [314, 368]], '#f4a261');
    circle(g, 295, 376, 2, '#20242e');
    circle(g, 305, 376, 2, '#20242e');
    g.strokeStyle = '#f4a261';
    g.lineWidth = 6;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(322, 408);
    g.quadraticCurveTo(340, 404, 338, 388);
    g.stroke();
    g.lineCap = 'butt';
  }
  // Potted plant (flower changes colour on the right).
  poly(g, [[408, 410], [432, 410], [428, 440], [412, 440]], '#e63946');
  g.strokeStyle = '#2a9d8f';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(420, 410);
  g.lineTo(420, 384);
  g.moveTo(420, 398);
  g.quadraticCurveTo(406, 390, 402, 378);
  g.moveTo(420, 398);
  g.quadraticCurveTo(434, 390, 438, 378);
  g.stroke();
  flower(g, 420, 378, right ? '#9b5de5' : '#ff5d8f', '#ffd93b');
  // Puddle (a ripple appears on the right).
  ellipse(g, 250, 465, 70, 16, '#5a7a9a');
  g.fillStyle = 'rgba(255,255,255,0.25)';
  g.fillRect(200, 460, 100, 4);
  if (right) {
    g.strokeStyle = 'rgba(255,255,255,0.85)';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(250, 465, 12, 0, Math.PI * 2);
    g.stroke();
  }
  // Rain (identical on both panels).
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 2;
  RAIN.forEach(([x, y]) => {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 6, y + 12);
    g.stroke();
  });
}

// ---------------------------------------------------------------------------
// LEVEL 5 — Starry Campsite. Differences:
// 1 tent colour · 2 moon phase · 3 star missing · 4 campfire log missing
// 5 lantern out · 6 backpack colour · 7 marshmallow missing · 8 owl missing
// 9 extra pine cone
// ---------------------------------------------------------------------------
export const CAMPSITE_DIFFS = [
  { x: 225, y: 365, r: 30, label: 'the tent changed colour' },
  { x: 470, y: 80, r: 30, label: 'the moon changed phase' },
  { x: 120, y: 60, r: 16, label: 'a star went out' },
  { x: 350, y: 430, r: 20, label: 'a log is missing from the fire' },
  { x: 120, y: 368, r: 26, label: 'the lantern went out' },
  { x: 432, y: 415, r: 24, label: 'the backpack changed colour' },
  { x: 308, y: 416, r: 16, label: 'the marshmallow is gone' },
  { x: 500, y: 238, r: 22, label: 'the owl flew away' },
  { x: 120, y: 480, r: 18, label: 'an extra pine cone appeared' },
];

// Stars, fixed positions (index 1 is the one that goes out on the right).
const CAMP_STARS = [
  [60, 50], [120, 60], [200, 40], [280, 70], [350, 45],
  [420, 60], [90, 120], [250, 110], [380, 130],
];

function drawCampsite(g, right) {
  // Night sky and ground.
  const sky = g.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0d1b3d');
  sky.addColorStop(1, '#274472');
  rect(g, 0, 0, 560, 300, sky);
  rect(g, 0, 300, 560, 220, '#2d4a2f');
  // Dirt patch around the fire.
  ellipse(g, 350, 440, 130, 30, '#4a3525');
  // Stars (one goes out on the right).
  CAMP_STARS.forEach(([x, y], i) => {
    if (right && i === 1) return;
    circle(g, x, y, i % 3 === 0 ? 3 : 2, '#ffffff');
  });
  // Moon (full on the left, crescent on the right).
  if (right) {
    g.fillStyle = '#f4f1de';
    g.beginPath();
    g.arc(470, 80, 30, -Math.PI / 2, Math.PI / 2);
    g.arc(486, 80, 28, Math.PI / 2, -Math.PI / 2, true);
    g.closePath();
    g.fill();
    circle(g, 478, 66, 3, '#d8d3b8');
  } else {
    circle(g, 470, 80, 30, '#f4f1de');
    circle(g, 458, 72, 6, '#d8d3b8');
    circle(g, 478, 90, 5, '#d8d3b8');
  }
  // Pine trees (left and right edges).
  rect(g, 52, 260, 16, 40, '#5d4037');
  poly(g, [[60, 160], [20, 250], [100, 250]], '#1e5631');
  poly(g, [[60, 190], [28, 265], [92, 265]], '#2a7a3f');
  poly(g, [[60, 220], [36, 280], [84, 280]], '#1e5631');
  rect(g, 492, 260, 16, 40, '#5d4037');
  poly(g, [[500, 160], [460, 250], [540, 250]], '#1e5631');
  poly(g, [[500, 190], [468, 265], [532, 265]], '#2a7a3f');
  poly(g, [[500, 220], [476, 280], [524, 280]], '#1e5631');
  // Owl on the right tree's branch (missing on the right).
  g.strokeStyle = '#5d4037';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(470, 250);
  g.lineTo(530, 250);
  g.stroke();
  if (!right) {
    ellipse(g, 500, 238, 14, 18, '#8b5e3c');
    circle(g, 500, 220, 10, '#8b5e3c');
    poly(g, [[492, 214], [495, 206], [499, 213]], '#8b5e3c');
    poly(g, [[502, 213], [506, 206], [508, 214]], '#8b5e3c');
    circle(g, 496, 219, 3, '#ffffff');
    circle(g, 504, 219, 3, '#ffffff');
    circle(g, 496, 219, 1.5, '#20242e');
    circle(g, 504, 219, 1.5, '#20242e');
    poly(g, [[500, 222], [497, 227], [503, 227]], '#fb8500');
  }
  // Tent (colour changes on the right).
  ellipse(g, 225, 422, 90, 10, 'rgba(0,0,0,0.25)');
  poly(g, [[150, 420], [225, 300], [300, 420]], right ? '#2a9d8f' : '#e76f51');
  poly(g, [[205, 420], [225, 360], [245, 420]], '#20242e');
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(225, 300);
  g.lineTo(225, 290);
  g.stroke();
  // Lantern on a stump (glow off on the right).
  rect(g, 105, 380, 30, 22, '#8b5e3c');
  ellipse(g, 120, 380, 18, 6, '#a9713f');
  if (!right) {
    const glow = g.createRadialGradient(120, 366, 4, 120, 366, 46);
    glow.addColorStop(0, 'rgba(255,214,64,0.5)');
    glow.addColorStop(1, 'rgba(255,214,64,0)');
    g.fillStyle = glow;
    g.fillRect(74, 320, 92, 92);
  }
  rect(g, 110, 352, 20, 28, right ? '#6c757d' : '#ffb703');
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.strokeRect(110, 352, 20, 28);
  g.beginPath();
  g.moveTo(120, 352);
  g.lineTo(120, 344);
  g.stroke();
  // Campfire: stones, logs (one missing on the right), flame.
  const stones = [[318, 438], [332, 448], [350, 450], [368, 448], [382, 438], [326, 430], [374, 430]];
  stones.forEach(([x, y]) => circle(g, x, y, 6, '#8d99ae'));
  g.strokeStyle = '#8b5e3c';
  g.lineWidth = 8;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(332, 444);
  g.lineTo(368, 416);
  g.stroke();
  if (!right) {
    g.beginPath();
    g.moveTo(368, 444);
    g.lineTo(332, 416);
    g.stroke();
  }
  g.lineCap = 'butt';
  // Flame.
  ellipse(g, 350, 402, 16, 24, '#fb8500');
  poly(g, [[350, 372], [338, 402], [362, 402]], '#fb8500');
  ellipse(g, 350, 410, 9, 14, '#ffd93b');
  // Marshmallow on a stick (missing on the right).
  if (!right) {
    g.strokeStyle = '#8b5e3c';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(290, 452);
    g.lineTo(308, 418);
    g.stroke();
    rect(g, 302, 408, 12, 14, '#ffffff');
    g.strokeStyle = '#d9d9d9';
    g.lineWidth = 1;
    g.strokeRect(302, 408, 12, 14);
  }
  // Backpack (colour changes on the right).
  rect(g, 415, 390, 34, 50, right ? '#2a9d8f' : '#e63946');
  rect(g, 415, 390, 34, 14, right ? '#1f7a6d' : '#b52a38');
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(424, 404);
  g.lineTo(424, 436);
  g.moveTo(440, 404);
  g.lineTo(440, 436);
  g.stroke();
  // Sleeping bag (decoration).
  ellipse(g, 200, 458, 40, 12, '#4361ee');
  circle(g, 168, 452, 9, '#f8f9fa');
  // Extra pine cone (appears on the right).
  if (right) {
    circle(g, 120, 480, 8, '#8b5e3c');
    circle(g, 116, 476, 2, '#5d4037');
    circle(g, 124, 478, 2, '#5d4037');
    circle(g, 120, 484, 2, '#5d4037');
  }
}

// ---------------------------------------------------------------------------
// LEVEL 6 — Busy Bakery. Differences:
// 1 clock time · 2 awning stripe · 3 loaf missing · 4 cherry missing
// 5 jar lid colour · 6 flour bag tipped · 7 rolling pin missing
// 8 cat ribbon · 9 apron pocket missing · 10 oven mitt colour
// ---------------------------------------------------------------------------
export const BAKERY_DIFFS = [
  { x: 420, y: 100, r: 32, label: 'the clock shows a different time' },
  { x: 129, y: 51, r: 24, label: 'an awning stripe changed colour' },
  { x: 450, y: 208, r: 18, label: 'a loaf vanished from the shelf' },
  { x: 300, y: 364, r: 16, label: 'the cherry is gone from the cake' },
  { x: 450, y: 372, r: 20, label: 'the cookie jar lid changed colour' },
  { x: 250, y: 482, r: 24, label: 'the flour bag tipped over' },
  { x: 182, y: 393, r: 18, label: 'the rolling pin is gone' },
  { x: 380, y: 390, r: 22, label: "the cat's ribbon changed colour" },
  { x: 500, y: 167, r: 20, label: 'the apron pocket is gone' },
  { x: 250, y: 392, r: 20, label: 'the oven mitt changed colour' },
];

function drawBakery(g, right) {
  // Wall, floor, skirting.
  rect(g, 0, 0, 560, 400, '#f7e3c3');
  rect(g, 0, 400, 560, 120, '#b07d4f');
  g.strokeStyle = 'rgba(122,74,33,0.5)';
  g.lineWidth = 2;
  for (let x = 0; x < 560; x += 46) {
    g.beginPath();
    g.moveTo(x, 400);
    g.lineTo(x + 20, 520);
    g.stroke();
  }
  rect(g, 0, 392, 560, 8, '#8a5a2b');
  // Window with sky (left).
  rect(g, 60, 60, 160, 140, '#20242e');
  rect(g, 68, 68, 144, 124, '#aee3ff');
  circle(g, 110, 100, 18, '#ffd93b');
  cloud(g, 170, 90, 0.8, '#ffffff');
  poly(g, [[70, 192], [110, 150], [150, 192]], '#7a9e7e');
  poly(g, [[140, 192], [175, 155], [210, 192]], '#5d8a68');
  g.strokeStyle = '#20242e';
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(140, 68);
  g.lineTo(140, 192);
  g.moveTo(68, 130);
  g.lineTo(212, 130);
  g.stroke();
  // Awning stripes (stripe 4 changes colour on the right).
  for (let i = 0; i < 8; i += 1) {
    const x = 52 + i * 22;
    const isDiff = i === 3;
    const col = isDiff ? (right ? '#4361ee' : '#e63946') : (i % 2 === 0 ? '#e63946' : '#fff8ec');
    rect(g, x, 40, 22, 22, col);
  }
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.strokeRect(52, 40, 176, 22);
  // Clock (hands move on the right: 3:00 -> 5:00).
  circle(g, 420, 100, 32, '#fff8ec');
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.arc(420, 100, 32, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    circle(g, 420 + Math.cos(a) * 26, 100 + Math.sin(a) * 26, 1.5, '#20242e');
  }
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(420, 100);
  g.lineTo(420, 78);
  g.stroke();
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(420, 100);
  if (right) g.lineTo(430, 117);
  else g.lineTo(440, 100);
  g.stroke();
  circle(g, 420, 100, 3, '#20242e');
  // Apron on a hook (pocket missing on the right).
  circle(g, 500, 116, 3, '#20242e');
  rect(g, 485, 128, 30, 62, '#2a9d8f');
  g.strokeStyle = '#1f7a6d';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(500, 128);
  g.lineTo(500, 116);
  g.stroke();
  if (!right) rect(g, 492, 160, 16, 14, '#1f7a6d');
  // Shelves with bread (middle loaf missing on the right).
  rect(g, 380, 220, 160, 10, '#8a5a2b');
  const loaves = [400, 450, 500];
  loaves.forEach((x, i) => {
    if (right && i === 1) return;
    ellipse(g, x, 208, 22, 12, '#e8b04b');
    g.strokeStyle = '#b07d4f';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x - 10, 204);
    g.quadraticCurveTo(x, 200, x + 10, 204);
    g.stroke();
  });
  // Second shelf with jars (decoration).
  rect(g, 380, 300, 160, 10, '#8a5a2b');
  rect(g, 400, 272, 24, 28, 'rgba(255,255,255,0.55)');
  rect(g, 400, 272, 24, 8, '#e63946');
  rect(g, 440, 276, 24, 24, 'rgba(255,255,255,0.55)');
  rect(g, 440, 276, 24, 8, '#2a9d8f');
  rect(g, 480, 270, 24, 30, 'rgba(255,255,255,0.55)');
  rect(g, 480, 270, 24, 8, '#4361ee');
  // Counter.
  rect(g, 40, 400, 480, 60, '#8a5a2b');
  rect(g, 40, 400, 480, 10, '#a9713f');
  // Oven door built into the counter front.
  rect(g, 60, 412, 120, 40, '#495057');
  rect(g, 75, 420, 90, 24, '#fb8500');
  g.strokeStyle = '#20242e';
  g.lineWidth = 2;
  g.strokeRect(75, 420, 90, 24);
  // Oven mitt on a hook (colour changes on the right).
  g.strokeStyle = '#20242e';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(250, 366);
  g.lineTo(250, 376);
  g.stroke();
  g.fillStyle = right ? '#4361ee' : '#e63946';
  g.beginPath();
  g.arc(250, 392, 13, 0, Math.PI * 2);
  g.fill();
  rect(g, 241, 388, 18, 16, right ? '#4361ee' : '#e63946');
  circle(g, 262, 392, 5, right ? '#4361ee' : '#e63946');
  // Rolling pin on the counter (missing on the right).
  if (!right) {
    rect(g, 160, 388, 44, 10, '#d9a066');
    rect(g, 152, 390, 10, 6, '#8b5e3c');
    rect(g, 202, 390, 10, 6, '#8b5e3c');
  }
  // Cake under a glass dome (cherry missing on the right).
  ellipse(g, 300, 402, 34, 8, '#ffffff');
  rect(g, 285, 372, 30, 30, '#ff8fa3');
  rect(g, 285, 372, 30, 10, '#ffffff');
  if (!right) {
    circle(g, 300, 366, 6, '#e63946');
    g.strokeStyle = '#2a9d8f';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(300, 360);
    g.quadraticCurveTo(305, 354, 310, 356);
    g.stroke();
  }
  g.strokeStyle = 'rgba(32,36,46,0.35)';
  g.lineWidth = 2;
  g.beginPath();
  g.arc(300, 400, 36, Math.PI, 0);
  g.stroke();
  // Cat asleep on the counter (ribbon changes colour on the right).
  ellipse(g, 380, 392, 26, 12, '#f4a261');
  circle(g, 398, 388, 10, '#f4a261');
  poly(g, [[392, 382], [394, 374], [399, 381]], '#f4a261');
  poly(g, [[399, 381], [404, 374], [406, 382]], '#f4a261');
  g.strokeStyle = '#f4a261';
  g.lineWidth = 5;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(358, 396);
  g.quadraticCurveTo(346, 392, 348, 382);
  g.stroke();
  g.lineCap = 'butt';
  poly(g, [[386, 388], [378, 382], [378, 394]], right ? '#4361ee' : '#e63946');
  poly(g, [[386, 388], [394, 382], [394, 394]], right ? '#4361ee' : '#e63946');
  // Cookie jar (lid changes colour on the right).
  rect(g, 435, 365, 30, 35, 'rgba(255,255,255,0.55)');
  circle(g, 444, 382, 5, '#8b5e3c');
  circle(g, 456, 388, 5, '#8b5e3c');
  circle(g, 450, 374, 5, '#8b5e3c');
  rect(g, 433, 358, 34, 10, right ? '#4361ee' : '#e63946');
  // Flour bag on the floor (tipped over on the right).
  if (right) {
    ellipse(g, 250, 484, 26, 13, '#fff8ec');
    circle(g, 222, 492, 4, '#ffffff');
    circle(g, 232, 496, 3, '#ffffff');
    circle(g, 214, 488, 3, '#ffffff');
    g.fillStyle = '#20242e';
    g.font = 'bold 10px Georgia, serif';
    g.textAlign = 'center';
    g.fillText('FLOUR', 250, 487);
  } else {
    rect(g, 230, 462, 40, 38, '#fff8ec');
    ellipse(g, 250, 462, 20, 8, '#e8e0d0');
    g.fillStyle = '#20242e';
    g.font = 'bold 11px Georgia, serif';
    g.textAlign = 'center';
    g.fillText('FLOUR', 250, 484);
  }
}

// --- new scenes, in level order (appended after the three in scenes.js) ---
export const NEW_SCENES = [
  { draw: drawRooftop, diffs: ROOFTOP_DIFFS },
  { draw: drawCampsite, diffs: CAMPSITE_DIFFS },
  { draw: drawBakery, diffs: BAKERY_DIFFS },
];
