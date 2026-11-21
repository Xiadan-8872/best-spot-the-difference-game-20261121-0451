// Synthesised sound effects through WebAudio: no audio files, nothing to load.
// One job: every pop, buzz, chime and tick the game makes.
let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol, slideTo) {
  if (muted) return;
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + startAt + dur);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

/** Bright two-note pop when a difference is found. */
export function playFound() {
  tone(660, 0, 0.12, 'sine', 0.22);
  tone(990, 0.07, 0.18, 'sine', 0.2);
}

/** Low buzz for a wrong click. */
export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.12, 110);
}

/** Rising arpeggio for clearing a level. */
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.2));
}

/** Soft click for buttons and hints. */
export function playClick() {
  tone(440, 0, 0.06, 'sine', 0.12);
}

/** Short warning tick in the last ten seconds. */
export function playTick() {
  tone(880, 0, 0.05, 'square', 0.06);
}

/** Gentle chime when a hint is spent. */
export function playHint() {
  tone(784, 0, 0.14, 'sine', 0.16);
  tone(1175, 0.09, 0.2, 'sine', 0.13);
}
