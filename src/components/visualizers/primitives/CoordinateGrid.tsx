import React from 'react';

interface CoordinateGridProps {
  width: number;
  height: number;
  xTicks?: number;
  yTicks?: number;
  xLabel?: string;
  yLabel?: string;
  className?: string;
}

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  width,
  height,
  xTicks = 5,
  yTicks = 4,
  xLabel = 'Token X Reserves',
  yLabel = 'Token Y Reserves',
  className = '',
}) => {
  const paddingLeft = 48;
  const paddingBottom = 30;
  const paddingTop = 24;
  const paddingRight = 20;

  const chartWidth = Math.max(10, width - paddingLeft - paddingRight);
  const chartHeight = Math.max(10, height - paddingTop - paddingBottom);

  const xGridLines = Array.from({ length: xTicks }).map((_, i) => {
    const x = paddingLeft + (chartWidth / (xTicks - 1)) * i;
    return x;
  });

  const yGridLines = Array.from({ length: yTicks }).map((_, i) => {
    const y = paddingTop + (chartHeight / (yTicks - 1)) * i;
    return y;
  });

  return (
    <svg
      width={width}
      height={height}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
    >
      <defs>
        <pattern
          id="grid-dots"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.75" fill="currentColor" className="text-zinc-500/20" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid-dots)" />

      {/* Vertical Grid Lines */}
      {xGridLines.map((x, i) => (
        <line
          key={`x-grid-${i}`}
          x1={x}
          y1={paddingTop}
          x2={x}
          y2={height - paddingBottom}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="text-zinc-500/15"
        />
      ))}

      {/* Horizontal Grid Lines */}
      {yGridLines.map((y, i) => (
        <line
          key={`y-grid-${i}`}
          x1={paddingLeft}
          y1={y}
          x2={width - paddingRight}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="text-zinc-500/15"
        />
      ))}

      {/* Axes */}
      <line
        x1={paddingLeft}
        y1={height - paddingBottom}
        x2={width - paddingRight}
        y2={height - paddingBottom}
        stroke="currentColor"
        strokeWidth="1"
        className="text-zinc-500/30"
      />
      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={height - paddingBottom}
        stroke="currentColor"
        strokeWidth="1"
        className="text-zinc-500/30"
      />

      {/* Axis Labels - Positioned safely inside viewport */}
      <text
        x={width - paddingRight}
        y={height - 10}
        textAnchor="end"
        fontSize="10"
        fontFamily="inherit"
        className="fill-zinc-500 font-mono"
      >
        {xLabel} →
      </text>

      <text
        x={paddingLeft + 4}
        y={paddingTop - 8}
        textAnchor="start"
        fontSize="10"
        fontFamily="inherit"
        className="fill-zinc-500 font-mono"
      >
        ↑ {yLabel}
      </text>
    </svg>
  );
};
