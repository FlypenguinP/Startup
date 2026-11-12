/**
 * Hero diagram: the axis bar turns from a wrong angle and settles inside
 * the window around the 87° target, while the readout prints the degrees.
 * The static markup already shows the settled state, so nothing is lost
 * without JS or with reduced motion.
 */
import { prefersReducedMotion, easeInOutCubic } from "./motion.js";

const TARGET = 87;
const WINDOW = 3;

// [to angle, move ms, hold ms]
const LEGS = [
  [58, 1600, 900],
  [112, 1900, 700],
  [94, 1200, 400],
  [86.6, 1000, 3800],
];

export function initAxis() {
  const bar = document.getElementById("axisBar");
  const value = document.getElementById("axisValue");
  const status = document.getElementById("axisStatus");
  const svg = document.querySelector(".axis-svg");
  if (!bar || !value || !status || !svg || prefersReducedMotion()) return;

  const render = (angle) => {
    bar.setAttribute("transform", `rotate(${(-angle).toFixed(2)})`);
    value.textContent = `${angle.toFixed(1)}°`;
    const off = Math.abs(angle - TARGET);
    status.textContent = off <= WINDOW
      ? `Within the target range`
      : `${off.toFixed(1)}° off target`;
  };

  let from = 86.6;
  let leg = 0;
  let legStart = null;
  let raf = 0;
  let running = false;

  const frame = (ts) => {
    if (legStart === null) legStart = ts;
    const [to, move, hold] = LEGS[leg];
    const t = ts - legStart;
    if (t <= move) render(from + (to - from) * easeInOutCubic(t / move));
    else if (t <= move + hold) render(to);
    else { from = to; leg = (leg + 1) % LEGS.length; legStart = ts; }
    raf = requestAnimationFrame(frame);
  };

  const start = () => { if (!running) { running = true; legStart = null; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  let visible = true;
  const sync = () => (visible && !document.hidden ? start() : stop());
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(svg);
  document.addEventListener("visibilitychange", sync);
}
