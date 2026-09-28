import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSimulationRibbon } from './HeroSimulationRibbon';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 sm:pt-16 pb-12 space-y-12 sm:space-y-16 overflow-hidden">
      {/* Background ambient lighting - subtle monochromatic halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-slate-200/40 dark:from-white/[0.04] to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Main Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Subtle Category Eyebrow */}
        <div className="text-xs uppercase tracking-[0.25em] text-secondary-theme font-medium">
          SupaDex Architecture
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-primary-theme leading-[1.08]">
          Pure liquidity.
          <br />
          <span className="text-secondary-theme font-normal">
            Zero toxic leakage.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-secondary-theme font-normal max-w-2xl mx-auto leading-relaxed">
          The first singleton exchange architecture unifying Concentrated Liquidity, Discretized Bins, and StableSwap with real-time dynamic LVR protection.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium bg-primary-theme text-accent-primary-text hover:opacity-90 transition-opacity apple-spring-press shadow-sm"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <Link
            to="/curves"
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium border border-hairline-theme bg-surface-theme/80 hover:bg-subtle-theme text-primary-theme transition-colors apple-spring-press"
          >
            <span>Explore Curve Math</span>
            <ChevronRight className="w-4 h-4 text-secondary-theme" />
          </Link>
        </div>
      </div>

      {/* Interactive Fluid Simulation Ribbon Canvas */}
      <div className="max-w-5xl mx-auto px-4">
        <HeroSimulationRibbon />
      </div>
    </section>
  );
};
