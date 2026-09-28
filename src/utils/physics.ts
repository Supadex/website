/**
 * SupaDex Fluid Physics & Motion Utilities
 * Modeled on Apple's standard spring physics and refined cubic-bezier curves.
 */

export interface SpringConfig {
  stiffness: number; // Spring tension (higher = snappier)
  damping: number;   // Friction / resistance (higher = less oscillate)
  mass: number;      // Inertia (higher = slower acceleration)
  precision?: number;// Threshold to snap to resting state
}

export const APPLE_SPRING: SpringConfig = {
  stiffness: 170,
  damping: 26,
  mass: 1,
  precision: 0.001,
};

export const SNAPPY_SPRING: SpringConfig = {
  stiffness: 240,
  damping: 28,
  mass: 0.8,
  precision: 0.001,
};

export const GENTLE_SPRING: SpringConfig = {
  stiffness: 120,
  damping: 20,
  mass: 1.2,
  precision: 0.001,
};

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamps value within [min, max]
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Standard Smoothstep interpolation
 */
export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Apple Standard Easing: cubic-bezier(0.16, 1, 0.3, 1)
 */
export function appleEaseOut(t: number): number {
  const clampedT = clamp(t, 0, 1);
  // Approximation of cubic-bezier(0.16, 1, 0.3, 1)
  return 1 - Math.pow(1 - clampedT, 3.5);
}

/**
 * Damped harmonic oscillator step function
 * Calculates new position and velocity given delta time (dt in seconds)
 */
export function stepSpring(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig = APPLE_SPRING,
  dt = 1 / 60
): { value: number; velocity: number; isSettled: boolean } {
  const { stiffness, damping, mass, precision = 0.001 } = config;
  
  // Spring force: F = -k * (x - target) - c * v
  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;

  // Euler-Cromer integration for numerical stability
  const nextVelocity = velocity + acceleration * dt;
  const nextValue = current + nextVelocity * dt;

  const isSettled =
    Math.abs(nextVelocity) < precision && Math.abs(nextValue - target) < precision;

  if (isSettled) {
    return { value: target, velocity: 0, isSettled: true };
  }

  return { value: nextValue, velocity: nextVelocity, isSettled: false };
}
