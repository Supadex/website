import React from 'react';
import { DeveloperPlayground } from '../components/sections/DeveloperPlayground';

export const DevelopersPage: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Smart Contract Infrastructure
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-primary-theme">
          Developer Hub & Hook SDK
        </h1>
        <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
          Build custom AMM hooks with low-overhead inline bitmask dispatch, 8-stage lifecycle execution, and native transient storage bindings.
        </p>
      </div>

      {/* Main Developer Playground */}
      <DeveloperPlayground />
    </div>
  );
};
