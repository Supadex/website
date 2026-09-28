import { useState, useEffect, useRef } from 'react';
import { stepSpring, type SpringConfig, APPLE_SPRING } from '../utils/physics';

/**
 * useSpring Hook - Drives state transitions using damped harmonic oscillation physics.
 */
export function useSpring(
  targetValue: number,
  config: SpringConfig = APPLE_SPRING
): number {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const velocityRef = useRef<number>(0);
  const currentRef = useRef<number>(targetValue);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    // If target equals current and velocity is 0, settle immediately
    if (Math.abs(targetValue - currentRef.current) < (config.precision || 0.001) && Math.abs(velocityRef.current) < (config.precision || 0.001)) {
      setCurrentValue(targetValue);
      currentRef.current = targetValue;
      return;
    }

    lastTimestampRef.current = null;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.064); // Cap max dt
      lastTimestampRef.current = timestamp;

      const { value, velocity, isSettled } = stepSpring(
        currentRef.current,
        targetValue,
        velocityRef.current,
        config,
        dt
      );

      currentRef.current = value;
      velocityRef.current = velocity;
      setCurrentValue(value);

      if (!isSettled) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetValue, config]);

  return currentValue;
}
