import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { ProtocolTelemetry } from '../components/sections/ProtocolTelemetry';
import { Card } from '../components/ui/Card';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Flagship Apple Minimalist Hero */}
      <HeroSection />

      {/* 2. Apple 3-Pillar Bento Showcase */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary-theme">
            Engineered for pure efficiency.
          </h2>
          <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
            Three fundamental breakthroughs unified into a single immutable execution layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bento Card 1: Multi-Curve */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-secondary-theme font-medium">
                Engine 01
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Tri-Curve Invariant Mesh
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Concentrated CLAMM ($xy=k$), Discretized Bins ($P_i \cdot x + y = L$), and StableSwap ($x+y$) operating seamlessly within one singleton vault.
              </p>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-secondary-theme">3 Invariants • 1 Vault</span>
              <Link
                to="/curves"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>Explore Curves</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Bento Card 2: LVR Shield */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-secondary-theme font-medium">
                Engine 02
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Dynamic LVR Protection
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Real-time volatility spread decay transforms toxic CEX-DEX arbitrage into protocol LP yield, preserving +18.4% passive liquidity returns.
              </p>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">+18.4% Real APY</span>
              <Link
                to="/simulator"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>Open Sandbox</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Bento Card 3: Dual-Ledger */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-secondary-theme font-medium">
                Engine 03
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Flash Vault & ERC-6909
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Internal multi-token claim ledger eliminates repetitive physical ERC-20 transfers across multi-hop routing, cutting execution gas by up to 22%.
              </p>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-secondary-theme">-22.6% Multi-Hop Gas</span>
              <Link
                to="/comparison"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>View Specs</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Live Protocol Telemetry Strip */}
      <ProtocolTelemetry />

      {/* 4. Apple Minimalist CTA Module */}
      <section className="max-w-5xl mx-auto px-4 text-center py-16 border-t border-hairline-theme space-y-6">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary-theme">
          Experience next-generation liquidity.
        </h2>
        <p className="text-sm sm:text-base text-secondary-theme max-w-xl mx-auto leading-relaxed">
          Access institutional liquidity pools with mathematically proven LVR resistance and zero flash loan exploit vectors.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium bg-primary-theme text-accent-primary-text hover:opacity-90 transition-opacity apple-spring-press"
          >
            <span>Launch WebApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <Link
            to="/developers"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium border border-hairline-theme bg-surface-theme hover:bg-subtle-theme text-primary-theme transition-colors apple-spring-press"
          >
            <span>Developer Documentation</span>
            <ChevronRight className="w-4 h-4 text-secondary-theme" />
          </Link>
        </div>
      </section>
    </div>
  );
};
