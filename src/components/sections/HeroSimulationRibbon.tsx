import React, { useRef } from 'react';
import { useCanvas, type CanvasRenderContext } from '../../hooks/useCanvas';
import { useTheme } from '../../context/ThemeContext';

interface HeroSimulationRibbonProps {
  className?: string;
}

export const HeroSimulationRibbon: React.FC<HeroSimulationRibbonProps> = ({ className = '' }) => {
  const { resolvedTheme } = useTheme();
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  const timeRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current.targetX = (e.clientX - rect.left) / rect.width;
    mousePos.current.targetY = (e.clientY - rect.top) / rect.height;
  };

  const handleMouseLeave = () => {
    mousePos.current.targetX = 0.5;
    mousePos.current.targetY = 0.5;
  };

  const draw = ({ ctx, width, height }: CanvasRenderContext) => {
    timeRef.current += 0.015;
    const t = timeRef.current;

    // Smooth mouse position with spring damping
    mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
    mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    // Clear frame
    ctx.clearRect(0, 0, width, height);

    const isDark = resolvedTheme === 'dark';
    const primaryColor = isDark ? 'rgba(34, 197, 94, ' : 'rgba(22, 163, 74, ';
    const secondaryColor = isDark ? 'rgba(168, 85, 247, ' : 'rgba(126, 34, 206, ';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.035)';

    // 1. Draw subtle background coordinate mesh
    const cols = 12;
    const rows = 6;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let c = 0; c <= cols; c++) {
      const x = (c / cols) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let r = 0; r <= rows; r++) {
      const y = (r / rows) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Multi-Curve Invariant Wave Ribbons
    const numCurves = 3;
    const pointsCount = 100;

    for (let c = 0; c < numCurves; c++) {
      ctx.beginPath();
      const wavePhase = t + c * (Math.PI / 3);
      const alpha = c === 0 ? 0.85 : c === 1 ? 0.45 : 0.25;
      const strokeColor = c === 0 ? primaryColor : secondaryColor;

      ctx.strokeStyle = `${strokeColor}${alpha})`;
      ctx.lineWidth = c === 0 ? 2.5 : 1.5;

      if (c > 0) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }

      for (let i = 0; i <= pointsCount; i++) {
        const normX = i / pointsCount;
        const px = normX * width;

        // Base AMM Hyperbola: y = 1 / x transformed to canvas
        const baseInv = Math.pow(1 - normX, 1.4) * (height * 0.7) + height * 0.15;

        // Mouse harmonic distortion
        const distFromMouse = Math.abs(normX - mx);
        const mouseRipple = Math.exp(-distFromMouse * 5) * (my - 0.5) * (height * 0.45);

        // Harmonic oscillator wave
        const harmonic =
          Math.sin(normX * Math.PI * 3 + wavePhase) * 16 * (1 - normX * 0.5) +
          Math.cos(normX * Math.PI * 5 - wavePhase * 0.7) * 8;

        const py = Math.min(height - 10, Math.max(10, baseInv + harmonic + mouseRipple));

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    // 3. Draw Active Invariant Operating Point (Tangent Marker)
    const activeNormX = 0.25 + mx * 0.5;
    const activePx = activeNormX * width;
    const activeBaseInv = Math.pow(1 - activeNormX, 1.4) * (height * 0.7) + height * 0.15;
    const activeHarmonic =
      Math.sin(activeNormX * Math.PI * 3 + t) * 16 * (1 - activeNormX * 0.5) +
      Math.cos(activeNormX * Math.PI * 5 - t * 0.7) * 8;
    const activeDist = Math.abs(activeNormX - mx);
    const activeRipple = Math.exp(-activeDist * 5) * (my - 0.5) * (height * 0.45);
    const activePy = Math.min(height - 10, Math.max(10, activeBaseInv + activeHarmonic + activeRipple));

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(activePx, activePy, 8, 0, Math.PI * 2);
    ctx.fillStyle = `${primaryColor}0.2)`;
    ctx.fill();

    // Solid center dot
    ctx.beginPath();
    ctx.arc(activePx, activePy, 4, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.fill();
    ctx.strokeStyle = `${primaryColor}0.9)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Invariant Tag label
    ctx.font = '10px "SF Mono", "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#9ca3af' : '#475569';
    ctx.fillText(`k = xy (${(activeNormX * 100).toFixed(0)}%)`, activePx + 12, activePy - 8);
  };

  const canvasRef = useCanvas(draw, { animate: true });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-hairline-theme bg-surface-theme/60 backdrop-blur-md transition-all duration-300 ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Top Left Tag */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#22c55e] animate-pulse" />
        <span className="text-[11px] font-mono text-secondary-theme uppercase tracking-wider font-semibold">
          Real-time Invariant Surface &bull; Dynamic Harmonic Simulation
        </span>
      </div>

      {/* Bottom Right Math Formula Indicator */}
      <div className="absolute bottom-3 right-4 font-mono text-xs text-tertiary-theme bg-elevated-theme/80 px-2.5 py-1 rounded-md border border-hairline-theme backdrop-blur-sm pointer-events-none">
        f(x, y) = 4A(x + y) + D
      </div>
    </div>
  );
};
