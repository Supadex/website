import React, { useMemo } from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { generateCLAMMCurve, generateStableCurve, type CurveType, type CurvePoint } from '../../../utils/ammCurves';
import { CoordinateGrid } from './CoordinateGrid';
import { useSpring } from '../../../hooks/useSpring';
import { useTheme } from '../../../context/ThemeContext';

interface CurvePlotterProps {
  curveType: CurveType;
  tradePointRatio?: number; // 0.0 to 1.0 position on curve
  width?: number;
  height?: number;
  amplification?: number; // For StableSwap
  liquidity?: number;
}

export const CurvePlotter: React.FC<CurvePlotterProps> = ({
  curveType,
  tradePointRatio = 0.5,
  width = 600,
  height = 360,
  amplification = 100,
  liquidity = 1200,
}) => {
  const animatedRatio = useSpring(tradePointRatio);
  const { resolvedTheme } = useTheme();

  // Compute curve points based on curve type
  const points = useMemo<CurvePoint[]>(() => {
    if (curveType === 'clamm') {
      return generateCLAMMCurve(liquidity, 0.4, 2.5, 90);
    } else if (curveType === 'stableamm') {
      return generateStableCurve(amplification, liquidity * 1.8, 90);
    } else {
      // BinAMM boundary curve
      return generateCLAMMCurve(liquidity * 0.9, 0.3, 3.0, 90);
    }
  }, [curveType, liquidity, amplification]);

  const canvasRef = useCanvas(
    ({ ctx, width: cWidth, height: cHeight }) => {
      ctx.clearRect(0, 0, cWidth, cHeight);

      if (points.length === 0) return;

      const paddingLeft = 48;
      const paddingBottom = 30;
      const paddingTop = 24;
      const paddingRight = 20;

      const chartW = cWidth - paddingLeft - paddingRight;
      const chartH = cHeight - paddingTop - paddingBottom;

      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      const minY = Math.min(...points.map((p) => p.y));
      const maxY = Math.max(...points.map((p) => p.y));

      const getScreenX = (x: number) =>
        paddingLeft + ((x - minX) / (maxX - minX || 1)) * chartW;
      const getScreenY = (y: number) =>
        cHeight - paddingBottom - ((y - minY) / (maxY - minY || 1)) * chartH;

      const isDark = resolvedTheme === 'dark';

      // Draw high-contrast green gradient fill beneath curve
      const gradient = ctx.createLinearGradient(0, paddingTop, 0, cHeight - paddingBottom);
      gradient.addColorStop(0, isDark ? 'rgba(34, 197, 94, 0.20)' : 'rgba(22, 163, 74, 0.16)');
      gradient.addColorStop(1, isDark ? 'rgba(34, 197, 94, 0.00)' : 'rgba(22, 163, 74, 0.00)');

      ctx.beginPath();
      ctx.moveTo(getScreenX(points[0].x), cHeight - paddingBottom);
      for (const pt of points) {
        ctx.lineTo(getScreenX(pt.x), getScreenY(pt.y));
      }
      ctx.lineTo(getScreenX(points[points.length - 1].x), cHeight - paddingBottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw main curve line with rich contrast
      ctx.beginPath();
      ctx.moveTo(getScreenX(points[0].x), getScreenY(points[0].y));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(getScreenX(points[i].x), getScreenY(points[i].y));
      }
      ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Calculate active trade point
      const activeIdx = Math.min(
        points.length - 1,
        Math.max(0, Math.floor(animatedRatio * (points.length - 1)))
      );
      const activePoint = points[activeIdx];
      const activeScreenX = getScreenX(activePoint.x);
      const activeScreenY = getScreenY(activePoint.y);

      // Draw dashed crosshair guidelines to axes
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
      // Horizontal to Y-axis
      ctx.moveTo(paddingLeft, activeScreenY);
      ctx.lineTo(activeScreenX, activeScreenY);
      // Vertical to X-axis
      ctx.moveTo(activeScreenX, cHeight - paddingBottom);
      ctx.lineTo(activeScreenX, activeScreenY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Draw active point outer pulse
      ctx.beginPath();
      ctx.arc(activeScreenX, activeScreenY, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(34, 197, 94, 0.35)' : 'rgba(22, 163, 74, 0.30)';
      ctx.fill();

      // Draw active point solid core
      ctx.beginPath();
      ctx.arc(activeScreenX, activeScreenY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.fill();
    },
    { animate: true }
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-hairline-theme bg-surface-theme/95 backdrop-blur-md transition-colors shadow-xs"
      style={{ minHeight: `${height}px` }}
    >
      <CoordinateGrid
        width={width}
        height={height}
        xLabel="Token X Reserves"
        yLabel="Token Y Reserves"
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 block w-full h-full cursor-crosshair"
      />
    </div>
  );
};
