import { useEffect, useRef } from 'react';
import { setupHiDPICanvas } from '../utils/canvasDpr';

export interface CanvasRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  timestamp: number;
  deltaTime: number;
  frame: number;
}

export type CanvasRenderCallback = (context: CanvasRenderContext) => void;

interface UseCanvasOptions {
  animate?: boolean;
  fpsLimit?: number;
}

export function useCanvas(
  render: CanvasRenderCallback,
  options: UseCanvasOptions = { animate: true }
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isRunning = true;

    const handleRender = (timestamp: number) => {
      if (!isRunning) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 300;
      const height = rect.height || 150;

      const { dpr } = setupHiDPICanvas(canvas, width, height);
      const ctx = canvas.getContext('2d');

      if (ctx) {
        frameCountRef.current += 1;
        renderRef.current({
          ctx,
          width,
          height,
          dpr,
          timestamp,
          deltaTime: Math.min(deltaTime, 0.1), // Cap to prevent huge jumps on tab switch
          frame: frameCountRef.current,
        });
      }

      if (options.animate) {
        animationFrameId.current = requestAnimationFrame(handleRender);
      }
    };

    if (options.animate) {
      animationFrameId.current = requestAnimationFrame(handleRender);
    } else {
      // Single static render pass
      requestAnimationFrame(handleRender);
    }

    return () => {
      isRunning = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [options.animate]);

  return canvasRef;
}
