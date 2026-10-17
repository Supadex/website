import React from 'react';
import { LvrShieldSandbox } from '../components/sections/LvrShieldSandbox';
import { HelpCircle } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Fee Protection Simulator
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          Dynamic Fee & Arbitrage Sandbox
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          When crypto prices move suddenly on centralized exchanges, automated bots rush to profit before decentralized pools can update. Learn how SupaDex's dynamic fee protects liquidity providers during market volatility.
        </p>
      </div>

      {/* Plain-English Concept Explainer */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-hairline-theme bg-surface-theme p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-500 font-semibold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>What is LVR (Loss-Versus-Rebalancing) in plain English?</span>
        </div>
        <p className="text-xs sm:text-sm text-secondary-theme leading-relaxed">
          When ETH price jumps by $50 on Binance, it takes seconds for decentralized pools to catch up. Fast trading bots exploit this brief lag to buy cheap tokens from the pool and sell them immediately for a guaranteed profit. This extracted profit comes directly out of the pockets of liquidity providers.
        </p>
        <p className="text-xs sm:text-sm text-secondary-theme leading-relaxed">
          <strong className="text-primary-theme">How SupaDex responds:</strong> Our experimental dynamic fee shield detects rapid price shocks and temporarily raises swap fees during the volatile seconds. This makes predatory bot trades unprofitable, keeping trading fees inside the pool where they belong.
        </p>
      </div>

      {/* Main LVR Sandbox */}
      <LvrShieldSandbox />
    </div>
  );
};
