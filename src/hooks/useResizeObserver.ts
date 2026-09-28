import { useState, useEffect, useRef } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * useResizeObserver Hook
 * Observes container dimensions with zero layout shift.
 */
export function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialize with current size
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, size };
}
