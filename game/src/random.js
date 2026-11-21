// A tiny seeded random generator, so decorative scatter (stars, petals, crumbs)
// is identical on both panels and identical every run. One job: deterministic noise.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick `count` points inside a box with a minimum gap, from a fixed seed. */
export function scatter(seed, count, x0, y0, x1, y1, minGap) {
  const rand = mulberry32(seed);
  const points = [];
  let guard = 0;
  while (points.length < count && guard < 4000) {
    guard += 1;
    const p = { x: x0 + rand() * (x1 - x0), y: y0 + rand() * (y1 - y0) };
    if (points.every((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 >= minGap * minGap)) points.push(p);
  }
  return points;
}
