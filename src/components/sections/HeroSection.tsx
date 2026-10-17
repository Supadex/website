import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSimulationRibbon } from './HeroSimulationRibbon';
import { ArrowUpRight, ChevronRight, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 sm:pt-16 pb-12 space-y-12 sm:space-y-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-slate-200/40 dark:from-white/[0.04] to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Main Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Category Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hairline-theme bg-subtle-theme text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          SupaDAO Exchange Architecture
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-primary-theme leading-[1.08]">
          One unified exchange.
          <br />
          <span className="text-secondary-theme font-normal">
            Three ways to trade and earn.
          </span>
        </h1>

        {/* Hero Subtitle in Accessible Plain English */}
        <p className="text-base sm:text-xl text-secondary-theme font-normal max-w-2xl mx-auto leading-relaxed">
          SupaDex brings concentrated ranges, stable asset pools, and discrete price bins together in one shared vault—giving traders the best price without jumping between separate platforms.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            href="https://app-supadex.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-primary-theme text-accent-primary-text hover:opacity-90 transition-opacity apple-spring-press shadow-sm"
          >
            <span>Launch Exchange</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <Link
            to="/curves"
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium border border-hairline-theme bg-surface-theme/80 hover:bg-subtle-theme text-primary-theme transition-colors apple-spring-press"
          >
            <span>How Trading Works</span>
            <ChevronRight className="w-4 h-4 text-secondary-theme" />
          </Link>
        </div>

        {/* Simple Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-secondary-theme">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Automated best-price routing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Up to 22% lower gas fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero manual curve selection</span>
          </div>
        </div>
      </div>

      {/* Interactive Fluid Simulation Ribbon Canvas */}
      <div className="max-w-5xl mx-auto px-4">
        <HeroSimulationRibbon />
      </div>
    </section>
  );
};
