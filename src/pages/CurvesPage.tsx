import React from 'react';
import { MultiCurveDemonstrator } from '../components/sections/MultiCurveDemonstrator';

export const CurvesPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Understanding AMM Curves
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          How Different Curves Work
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          An automated market maker (AMM) determines token prices using mathematical formulas called "curves". SupaDex unites the three most proven models so every trade happens on the ideal curve.
        </p>
      </div>

      {/* Plain-English Quick Guide for Everyday Users */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-hairline-theme bg-surface-theme p-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
            Concentrated (CLAMM)
          </div>
          <div className="text-base font-semibold text-primary-theme">
            For Volatile Pairs (ETH / USDC)
          </div>
          <p className="text-xs leading-5 text-secondary-theme">
            Instead of spreading money across infinite prices where trades never happen, liquidity providers concentrate capital within active ranges. This means better prices for traders with less total capital needed.
          </p>
        </div>

        <div className="rounded-2xl border border-hairline-theme bg-surface-theme p-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
            Discrete Bins (BinAMM)
          </div>
          <div className="text-base font-semibold text-primary-theme">
            Order Book Style (Limit Buckets)
          </div>
          <p className="text-xs leading-5 text-secondary-theme">
            Tokens are grouped into step-by-step price buckets (bins). As long as a bin has available inventory, your trade executes at that exact price with zero slippage.
          </p>
        </div>

        <div className="rounded-2xl border border-hairline-theme bg-surface-theme p-6 space-y-2">
          <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
            Stable Pools (StableAMM)
          </div>
          <div className="text-base font-semibold text-primary-theme">
            Pegged Pairs (USDC / USDT)
          </div>
          <p className="text-xs leading-5 text-secondary-theme">
            Because stablecoins should always equal $1.00, this curve flattens price changes around parity. You can trade large amounts without worrying about price impact.
          </p>
        </div>
      </div>

      {/* Main Multi-Curve Interactive Demonstrator */}
      <MultiCurveDemonstrator />
    </div>
  );
};
