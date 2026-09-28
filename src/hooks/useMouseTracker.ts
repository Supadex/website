import { useState, useEffect, useCallback, useRef } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
  isHovered: boolean;
}

/**
 * useMouseTracker Hook
 * Tracks mouse coordinates relative to an element or container with smooth normalized values.
 */
export function useMouseTracker<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const normalizedY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

    setPosition({
      x,
      y,
      normalizedX,
      normalizedY,
      isHovered: true,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setPosition((prev) => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      normalizedX: 0,
      normalizedY: 0,
      isHovered: false,
    }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return { containerRef, position };
}
