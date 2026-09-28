import React, { useMemo } from 'react';
import { generateBinAMMData, type LiquidityBin } from '../../../utils/ammCurves';
import { formatNumber } from '../../../utils/formatters';

interface BinBarChartProps {
  activePrice?: number;
  binStepBps?: number;
  totalLiquidity?: number;
  selectedBinId?: number;
  onSelectBin?: (bin: LiquidityBin) => void;
  height?: number;
}

export const BinBarChart: React.FC<BinBarChartProps> = ({
  activePrice = 1.0,
  binStepBps = 20,
  totalLiquidity = 50000,
  selectedBinId,
  onSelectBin,
  height = 360,
}) => {
  const bins = useMemo(
    () => generateBinAMMData(activePrice, binStepBps, 21, totalLiquidity),
    [activePrice, binStepBps, totalLiquidity]
  );

  const maxBinLiq = useMemo(
    () => Math.max(...bins.map((b) => b.totalLiquidity), 1),
    [bins]
  );

  const plotHeight = height - 90;

  return (
    <div
      className="relative w-full rounded-xl border border-hairline-theme bg-surface-theme/95 backdrop-blur-md p-5 flex flex-col justify-between transition-colors shadow-xs"
      style={{ minHeight: `${height}px` }}
    >
      {/* Top Legend */}
      <div className="flex items-center justify-between text-xs text-secondary-theme mb-3 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#16a34a] dark:bg-[#22c55e]"></span>
            <span>Reserve Y (Bid Depth)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#9333ea] dark:bg-[#c084fc]"></span>
            <span>Reserve X (Ask Depth)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-white border border-slate-400 dark:border-white/40"></span>
            <span>Active Price Bin</span>
          </span>
        </div>
        <div className="font-mono text-secondary-theme bg-subtle-theme px-2 py-0.5 rounded border border-hairline-theme">
          Bin Step: {(binStepBps / 100).toFixed(2)}%
        </div>
      </div>

      {/* Bars Chart Area */}
      <div
        className="w-full flex items-end justify-between gap-1 pt-4 pb-2 border-b border-hairline-theme"
        style={{ height: `${plotHeight}px` }}
      >
        {bins.map((bin) => {
          const heightPct = Math.max(12, (bin.totalLiquidity / maxBinLiq) * 100);
          const isSelected = selectedBinId === bin.id;

          let barColor = 'bg-[#16a34a]/85 dark:bg-[#22c55e]/80 hover:bg-[#16a34a] dark:hover:bg-[#22c55e]';
          if (bin.isActive) {
            barColor = 'bg-white shadow-[0_0_14px_rgba(22,163,74,0.6)] ring-2 ring-[#16a34a] dark:ring-[#22c55e]';
          } else if (bin.id > 0) {
            barColor = 'bg-[#9333ea]/85 dark:bg-[#a855f7]/80 hover:bg-[#9333ea] dark:hover:bg-[#a855f7]';
          }

          return (
            <div
              key={bin.id}
              onClick={() => onSelectBin?.(bin)}
              className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
            >
              {/* Hover Tooltip */}
              <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-30 bg-slate-900 text-white border border-white/20 rounded-md px-2.5 py-1.5 text-[11px] whitespace-nowrap shadow-xl">
                <p className="font-mono font-semibold">Price: ${bin.price.toFixed(4)}</p>
                <p className="text-zinc-400 text-[10px]">
                  Depth: ${formatNumber(bin.totalLiquidity, 0)} {bin.isActive ? '(Active)' : ''}
                </p>
              </div>

              {/* Bar Column */}
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${barColor} ${
                    isSelected ? 'ring-2 ring-white scale-105' : ''
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Ticks underneath */}
              <div className="mt-2 text-[9px] font-mono text-tertiary-theme truncate w-full text-center select-none">
                {bin.isActive ? (
                  <span className="font-bold text-[#16a34a] dark:text-[#22c55e]">● ${bin.price.toFixed(2)}</span>
                ) : (
                  `$${bin.price.toFixed(2)}`
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="flex items-center justify-between text-[11px] text-tertiary-theme pt-3 select-none">
        <span className="font-mono">← Lower Bins (Token Y)</span>
        <span className="font-semibold text-primary-theme">Zero Slippage Bin Liquidity Invariant</span>
        <span className="font-mono">Upper Bins (Token X) →</span>
      </div>
    </div>
  );
};
