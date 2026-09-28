import React from 'react';
import { useSpring } from '../../../hooks/useSpring';
import { useTheme } from '../../../context/ThemeContext';

interface DynamicSpreadDialProps {
  activeSpreadBps: number; // e.g. 24.5 bps
  baseFeeBps?: number;     // e.g. 5 bps
  maxSpreadBps?: number;   // e.g. 100 bps
  mevProtectionPct: number;// e.g. 84.5%
  size?: number;
}

export const DynamicSpreadDial: React.FC<DynamicSpreadDialProps> = ({
  activeSpreadBps,
  baseFeeBps = 5,
  maxSpreadBps = 100,
  mevProtectionPct,
  size = 180,
}) => {
  const animatedSpread = useSpring(activeSpreadBps);
  const animatedProtection = useSpring(mevProtectionPct);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius; // Half circle arc
  const spreadProgress = Math.min(1, Math.max(0, animatedSpread / maxSpreadBps));
  const strokeDashoffset = circumference * (1 - spreadProgress);

  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-xl border border-hairline-theme bg-surface-theme/95 backdrop-blur-md transition-colors"
      style={{ width: `${size + 32}px` }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.65 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute top-0 overflow-visible"
        >
          {/* Background Arc */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Base Fee Segment Marker */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke={isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - (baseFeeBps / maxSpreadBps))}
            strokeLinecap="round"
          />

          {/* Dynamic Spread Active Arc with rich contrast green */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke={isDark ? '#22c55e' : '#16a34a'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute top-1/3 flex flex-col items-center text-center">
          <span className="text-2xl font-bold font-mono tracking-tight text-primary-theme">
            {animatedSpread.toFixed(1)} <span className="text-xs text-secondary-theme font-sans font-normal">bps</span>
          </span>
          <span className="text-[10px] text-tertiary-theme uppercase tracking-wider mt-0.5 font-semibold">
            Dynamic Fee
          </span>
        </div>
      </div>

      {/* Retention Rate Badge with rich green */}
      <div className="mt-2 flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">LVR Captured</span>
        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
          +{animatedProtection.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
