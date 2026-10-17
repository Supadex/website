import React from 'react';
import { ArchitectureMatrix } from '../components/sections/ArchitectureMatrix';

export const ComparisonPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Architecture Comparison
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          How SupaDex Compares
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          See how our singleton architecture, internal token ledger, and multi-curve settlement stack up against traditional automated market makers.
        </p>
      </div>

      {/* Summary Matrix Component */}
      <ArchitectureMatrix />
    </div>
  );
};
