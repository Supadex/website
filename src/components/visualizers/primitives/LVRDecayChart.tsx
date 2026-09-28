import React, { useMemo } from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { useSpring } from '../../../hooks/useSpring';
import { useTheme } from '../../../context/ThemeContext';
import { generateLVRDecayCurve } from '../../../utils/ammCurves';

interface LVRDecayChartProps {
  volatilitySigma: number;
  cexJumpBps: number;
  decayTimeSec: number;
  baseFeeBps?: number;
  maxTimeSec?: number;
  className?: string;
}

export const LVRDecayChart: React.FC<LVRDecayChartProps> = ({
  volatilitySigma,
  cexJumpBps,
  decayTimeSec,
  baseFeeBps = 5,
  maxTimeSec = 30,
  className = '',
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Smooth springs for reactive updates
  const animatedDecayTime = useSpring(decayTimeSec);
  const animatedCexJump = useSpring(cexJumpBps);
  const animatedSigma = useSpring(volatilitySigma);

  // Generate decay points
  const points = useMemo(() => {
    return generateLVRDecayCurve(animatedSigma, animatedCexJump, baseFeeBps, maxTimeSec, 80);
  }, [animatedSigma, animatedCexJump, baseFeeBps, maxTimeSec]);

  // Max scale calculation
  const maxFee = useMemo(() => {
    const highestPoint = Math.max(...points.map((p) => p.feeBps), animatedCexJump * 1.15, 60);
    return Math.ceil(highestPoint / 20) * 20;
  }, [points, animatedCexJump]);

  const canvasRef = useCanvas(
    ({ ctx, width, height }) => {
      ctx.clearRect(0, 0, width, height);
      // Padding
      const padLeft = 46;
      const padRight = 24;
      const padTop = 20;
      const padBottom = 32;

      const chartW = width - padLeft - padRight;
      const chartH = height - padTop - padBottom;

      if (chartW <= 0 || chartH <= 0) return;

      // Coordinate transforms
      const getX = (t: number) => padLeft + (t / maxTimeSec) * chartW;
      const getY = (fee: number) => padTop + chartH - (fee / maxFee) * chartH;

      // Colors
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
      const textColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
      const accentGreen = isDark ? '#22c55e' : '#16a34a';
      const accentRed = isDark ? '#f87171' : '#dc2626';
      const baseFeeColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';

      // 1. Draw Grid Lines & Y-Axis labels
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.fillStyle = textColor;
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const yTicks = 4;
      for (let i = 0; i <= yTicks; i++) {
        const val = (maxFee / yTicks) * i;
        const y = getY(val);
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();

        ctx.fillText(`${Math.round(val)}b`, padLeft - 6, y);
      }

      // 2. Draw X-Axis ticks (Time in seconds)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const xTicks = 6;
      for (let i = 0; i <= xTicks; i++) {
        const t = (maxTimeSec / xTicks) * i;
        const x = getX(t);
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, padTop + chartH);
        ctx.stroke();

        ctx.fillText(`${t}s`, x, padTop + chartH + 6);
      }

      // 3. Base Pool Fee Reference Line
      const baseFeeY = getY(baseFeeBps);
      ctx.save();
      ctx.strokeStyle = baseFeeColor;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, baseFeeY);
      ctx.lineTo(width - padRight, baseFeeY);
      ctx.stroke();
      ctx.restore();

      // 4. CEX Price Jump / Arbitrage Threshold Line
      const cexY = getY(animatedCexJump);
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(248, 113, 113, 0.6)' : 'rgba(220, 38, 38, 0.6)';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, cexY);
      ctx.lineTo(width - padRight, cexY);
      ctx.stroke();
      ctx.restore();

      // Label for CEX Shock
      ctx.fillStyle = accentRed;
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`CEX Jump: ${animatedCexJump.toFixed(0)} bps`, width - padRight - 4, cexY - 7);

      // 5. Fill Protected MEV Retention Area under dynamic curve
      if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(getX(points[0].t), getY(points[0].feeBps));
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(getX(points[i].t), getY(points[i].feeBps));
        }
        ctx.lineTo(getX(points[points.length - 1].t), getY(baseFeeBps));
        ctx.lineTo(getX(points[0].t), getY(baseFeeBps));
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        grad.addColorStop(0, isDark ? 'rgba(34, 197, 94, 0.22)' : 'rgba(22, 163, 74, 0.18)');
        grad.addColorStop(1, isDark ? 'rgba(34, 197, 94, 0.01)' : 'rgba(22, 163, 74, 0.01)');
        ctx.fillStyle = grad;
        ctx.fill();

        // 6. Draw Dynamic Decay Curve Line
        ctx.beginPath();
        ctx.strokeStyle = accentGreen;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(getX(points[0].t), getY(points[0].feeBps));
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(getX(points[i].t), getY(points[i].feeBps));
        }
        ctx.stroke();
      }

      // 7. Active Time Marker (Current Simulation Step)
      const curT = Math.max(0, Math.min(maxTimeSec, animatedDecayTime));
      const curX = getX(curT);
      const alpha = 1.25;
      const lambda = 0.16;
      const curSpike = alpha * animatedSigma * 100 * Math.exp(-lambda * curT);
      const curFee = Math.min(160, baseFeeBps + curSpike);
      const curY = getY(curFee);

      // Vertical marker line
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(curX, padTop);
      ctx.lineTo(curX, padTop + chartH);
      ctx.stroke();
      ctx.restore();

      // Outer halo
      ctx.beginPath();
      ctx.arc(curX, curY, 7, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(34, 197, 94, 0.35)' : 'rgba(22, 163, 74, 0.25)';
      ctx.fill();

      // Center glowing dot
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      ctx.fillStyle = accentGreen;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#08090B' : '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Active label popup above current point
      const labelText = `δ(${curT.toFixed(1)}s) = ${curFee.toFixed(1)} bps`;
      ctx.font = 'bold 10px ui-monospace, SFMono-Regular, monospace';
      const textWidth = ctx.measureText(labelText).width;
      const labelX = Math.max(padLeft + textWidth / 2 + 6, Math.min(width - padRight - textWidth / 2 - 6, curX));
      const labelY = Math.max(padTop + 14, curY - 14);

      ctx.fillStyle = isDark ? 'rgba(17, 19, 23, 0.92)' : 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      
      const p = 4;
      ctx.beginPath();
      ctx.roundRect(labelX - textWidth / 2 - p, labelY - 9, textWidth + p * 2, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = accentGreen;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, labelX, labelY - 1);
    },
    { animate: true }
  );


  return (
    <div className={`relative w-full h-[230px] rounded-xl border border-hairline-theme bg-surface-theme/60 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Chart Top Bar Legend */}
      <div className="absolute top-2.5 right-3 flex items-center gap-3 text-[10px] font-mono z-10 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 rounded-full bg-[#16a34a] dark:bg-[#22c55e]" />
          <span className="text-secondary-theme">δ(t) Dynamic Fee</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 border-t border-dashed border-red-500" />
          <span className="text-secondary-theme">CEX Shock</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 border-t border-dashed border-tertiary-theme" />
          <span className="text-tertiary-theme">Base (5 bps)</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
