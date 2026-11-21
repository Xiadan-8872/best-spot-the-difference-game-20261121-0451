# Odd Twin — Spot the Difference

Two pictures. One is lying. Find every difference.

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files — no network, no libraries, no build step. All art
is drawn in code (canvas vector scenes); all sounds are synthesised with
WebAudio.

## How to play

- **Click a difference in either picture.** Found differences get a green ring
  and a check mark on both panels.
- **Wrong clicks** cost 25 points and 2 seconds, and reset your combo.
- **Combos pay:** consecutive finds without a miss are worth 100, 200, 300…
  points each.
- **Hints (H):** 3 per level, each rings an unfound difference for a few
  seconds and costs 50 points.
- **Keys:** H hint · P pause · R restart level · M mute · Esc menu ·
  1 / 2 / 3 jump to a level · Enter start / next.

## Levels

1. **Sunny Park** (easy) — 7 differences, 3:00
2. **Cozy Café** (medium) — 7 differences, 2:30
3. **Moonlit Harbour** (hard) — 8 differences, 2:00

Clear a level to earn a time bonus and 1–3 stars (3 stars for a perfect run
with no misses). Find all 22 differences to win.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Screenshots are staged deterministically with `?shot=start|play|end`
(see `game/src/shots.js` and `shots.json`): the play shot shows three
differences already found, four still hidden, and the counter reading
`FOUND 3 / 7 · 4 TO GO`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored `vendor/makefun-game.ts` library.

## Layout

- `game/index.html` — page shell and canvas
- `game/src/config.js` — sizes, timings, scoring
- `game/src/scenes.js` — the three original scenes and their differences
- `game/src/game.js` — rules: state, scoring, timer, hints
- `game/src/input.js` — pointer and keyboard input
- `game/src/render.js` — all canvas drawing: panels, HUD, screens
- `game/src/audio.js` — synthesised sound effects
- `game/src/random.js` — seeded random for deterministic decoration
- `game/src/shots.js` — deterministic screenshot staging
- `game/src/main.js` — bootstrap and frame loop

MIT licensed. Original art, sounds, music and names throughout.
