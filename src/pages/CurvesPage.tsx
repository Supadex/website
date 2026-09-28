import React from 'react';
import { MultiCurveDemonstrator } from '../components/sections/MultiCurveDemonstrator';

export const CurvesPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          AMM Invariant Engines
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          Three Curves. One Singleton.
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          SupaDex natively executes Concentrated Liquidity, Discretized Bins, and StableSwap within the exact same singleton vault, enabling optimal routing across heterogeneous asset pairs.
        </p>
      </div>

      {/* Main Multi-Curve Interactive Demonstrator */}
      <MultiCurveDemonstrator />
    </div>
  );
};
