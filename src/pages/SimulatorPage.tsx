import React from 'react';
import { LvrShieldSandbox } from '../components/sections/LvrShieldSandbox';

export const SimulatorPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          MEV & Arbitrage Defense
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          Dynamic LVR Sandbox
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          Simulate high-frequency CEX-DEX price shocks, observe volatility-scaled spread decay physics, and test anti-JIT fee vesting in real-time.
        </p>
      </div>

      {/* Main LVR Sandbox */}
      <LvrShieldSandbox />
    </div>
  );
};
