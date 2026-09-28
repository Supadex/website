import React, { useState } from 'react';
import { ComparisonGrid } from './ComparisonGrid';
import { ArchitectureDeepDive } from './ArchitectureDeepDive';

export const ArchitectureMatrix: React.FC = () => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('lvr-protection');

  const handleSelectDeepDive = (featureId: string) => {
    setSelectedFeatureId(featureId);
    const deepDiveElement = document.getElementById('deep-dive-section');
    if (deepDiveElement) {
      deepDiveElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Architectural Benchmarks
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary-theme">
          Conventional AMMs vs. SupaDex
        </h2>

        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          While legacy AMM architectures leave liquidity providers exposed to toxic latency arbitrage and restrict pools to a single concentrated curve, SupaDex re-engineers the AMM stack for maximum capital efficiency, real LP yield preservation, and multi-curve settlement.
        </p>

        {/* Quick Value Metrics Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs text-secondary-theme">
          <span className="bg-subtle-theme px-3 py-1 rounded-full border border-hairline-theme">
            Zero Arbitrage Leakage
          </span>
          <span className="bg-subtle-theme px-3 py-1 rounded-full border border-hairline-theme">
            Flash ERC-6909 Vault Claims
          </span>
          <span className="bg-subtle-theme px-3 py-1 rounded-full border border-hairline-theme">
            3 Native Curve Engines
          </span>
          <span className="bg-subtle-theme px-3 py-1 rounded-full border border-hairline-theme">
            Anti-JIT Fee Vesting
          </span>
        </div>
      </div>

      {/* 1. Master Comparison Grid */}
      <ComparisonGrid
        selectedFeatureId={selectedFeatureId}
        onSelectDeepDive={handleSelectDeepDive}
      />

      {/* 2. Expandable Technical Deep Dive with Solidity Source Diffs */}
      <div id="deep-dive-section" className="pt-4 scroll-mt-24">
        <ArchitectureDeepDive
          selectedId={selectedFeatureId}
          onSelectSnippet={setSelectedFeatureId}
        />
      </div>
    </div>
  );
};
