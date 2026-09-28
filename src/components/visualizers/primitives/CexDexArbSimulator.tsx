import React from 'react';
import { formatNumber, formatPercent } from '../../../utils/formatters';

interface CexDexArbSimulatorProps {
  cexJumpBps: number;
  activeSpreadBps: number;
  staticArbLoss: number;
  dynamicRetainedYield: number;
  mevProtectionPct: number;
  tradeSizeUsd: number;
  latencyMs: number;
  isSimulating?: boolean;
}

export const CexDexArbSimulator: React.FC<CexDexArbSimulatorProps> = ({
  cexJumpBps,
  activeSpreadBps,
  staticArbLoss,
  dynamicRetainedYield,
  mevProtectionPct,
  tradeSizeUsd,
  latencyMs,
  isSimulating = false,
}) => {
  const isFullyProtected = activeSpreadBps >= cexJumpBps;

  return (
    <div className="space-y-4">
      {/* Visual Step-by-Step Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: External CEX Price Shock */}
        <div className="p-3.5 rounded-xl border border-hairline-theme bg-subtle-theme/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-tertiary-theme uppercase tracking-wider font-semibold">
              Stage 1 · External Shock
            </span>
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-amber-500 animate-ping' : 'bg-amber-500/70'}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-secondary-theme font-medium">Binance / Coinbase:</span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                +{cexJumpBps} bps shock
              </span>
            </div>
            <p className="text-[11px] text-tertiary-theme leading-tight">
              Rapid price divergence creates ${formatNumber(staticArbLoss, 0)} MEV opportunity.
            </p>
          </div>
        </div>

        {/* Step 2: Searcher Latency & Routing */}
        <div className="p-3.5 rounded-xl border border-hairline-theme bg-subtle-theme/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-tertiary-theme uppercase tracking-wider font-semibold">
              Stage 2 · MEV Searcher
            </span>
            <span className="text-[10px] font-mono text-secondary-theme bg-surface-theme px-1.5 py-0.5 rounded border border-hairline-theme">
              {latencyMs}ms latency
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-secondary-theme font-medium">Arb Trade Size:</span>
              <span className="text-xs font-mono font-bold text-primary-theme">
                ${formatNumber(tradeSizeUsd, 0)}
              </span>
            </div>
            <p className="text-[11px] text-tertiary-theme leading-tight">
              Bot targets pool via builder bundle before mempool propagation.
            </p>
          </div>
        </div>

        {/* Step 3: SupaDex Dynamic Defense */}
        <div className={`p-3.5 rounded-xl border ${
          isFullyProtected 
            ? 'border-emerald-500/30 bg-emerald-500/5' 
            : 'border-amber-500/30 bg-amber-500/5'
        } relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400">
              Stage 3 · Dynamic Spread
            </span>
            <span className={`w-2 h-2 rounded-full ${isFullyProtected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-secondary-theme font-medium">Dynamic Fee:</span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {activeSpreadBps.toFixed(1)} bps
              </span>
            </div>
            <p className="text-[11px] text-tertiary-theme leading-tight">
              {isFullyProtected
                ? 'Spread exceeds arb margin. Toxic MEV fully converted to LP yield.'
                : 'Decay progressing. Partial protection absorbs toxic arbitrage.'}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Architectural Outcome Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Unprotected Standard AMM (Constant Fee) */}
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-700 dark:text-red-300">
                Standard AMM (Static Fee 5 bps)
              </span>
            </div>
            <span className="text-[10px] font-mono text-red-700 dark:text-red-400 uppercase font-semibold">
              Unprotected
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-red-500/15 text-secondary-theme">
              <span>Pool Fee Charged:</span>
              <span className="font-mono text-primary-theme">0.05% (5.0 bps)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-red-500/15 text-secondary-theme">
              <span>Arb Arbitrage Profit:</span>
              <span className="font-mono text-red-700 dark:text-red-400 font-semibold">
                +${formatNumber(staticArbLoss, 0)}
              </span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span className="text-red-700 dark:text-red-400">Net LP Loss to MEV:</span>
              <span className="font-mono text-red-700 dark:text-red-300 font-bold">
                -${formatNumber(staticArbLoss, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* SupaDex Protected Model */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                SupaDex Dynamic LVR Spread
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold">
              Protected ({formatPercent(mevProtectionPct / 100, 0)})
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-emerald-500/15 text-secondary-theme">
              <span>Dynamic Spread Charged:</span>
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                {(activeSpreadBps / 100).toFixed(3)}% ({activeSpreadBps.toFixed(1)} bps)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-500/15 text-secondary-theme">
              <span>MEV Captured for LPs:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                +${formatNumber(dynamicRetainedYield, 0)}
              </span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span className="text-emerald-700 dark:text-emerald-300">Net LP Loss to MEV:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                $0.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
