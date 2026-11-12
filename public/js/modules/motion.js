/**
 * Shared motion helpers.
 */

/** True when the user has asked the OS to minimise animation. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Cubic ease-in-out. */
export const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Cubic ease-out. */
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
