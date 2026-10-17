import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { ProtocolTelemetry } from '../components/sections/ProtocolTelemetry';
import { Card } from '../components/ui/Card';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Flagship Hero */}
      <HeroSection />

      {/* 2. Three Trading Engines Explained for Everyday Users */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary-theme">
            The right pool for every trade.
          </h2>
          <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
            Different tokens behave differently. SupaDex uses three specialized models behind the scenes, so you always get the lowest slippage without having to understand the math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: Concentrated Liquidity */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-semibold text-sm">
                01
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Concentrated Pools
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Best for active pairs like ETH and USDC. Liquidity providers place funds where trades actually happen, giving traders deep liquidity and lower price impact with less total capital.
              </p>
              <div className="text-xs text-tertiary-theme pt-2">
                Ideal for: Volatile token pairs & major crypto assets.
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400">High Fee Efficiency</span>
              <Link
                to="/curves"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Card 2: Fixed-Price Bins */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-semibold text-sm">
                02
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Discrete Price Bins
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Like an order book on the blockchain. Tokens are organized into clear price buckets, giving you exact, zero-slippage pricing as long as inventory remains in that specific price bin.
              </p>
              <div className="text-xs text-tertiary-theme pt-2">
                Ideal for: Transparent limit-style pricing & emerging tokens.
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400">Zero In-Bin Slippage</span>
              <Link
                to="/curves"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Card 3: Stable Pools */}
          <Card className="p-8 bg-surface-theme border-hairline-theme hover:border-border-theme transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-semibold text-sm">
                03
              </div>
              <h3 className="text-2xl font-semibold text-primary-theme tracking-tight">
                Stable Asset Pairs
              </h3>
              <p className="text-sm text-secondary-theme leading-relaxed">
                Specially designed for tokens pegged to the same dollar value (like USDC to USDT). Flattens price changes near 1:1, so large trades experience near-zero fee loss.
              </p>
              <div className="text-xs text-tertiary-theme pt-2">
                Ideal for: Stablecoins and liquid staked tokens.
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400">Near-Zero Slippage</span>
              <Link
                to="/curves"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-theme hover:text-emerald-500 transition-colors"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Real Benefits for Users (Why It Matters) */}
      <section className="rounded-3xl border border-hairline-theme bg-surface-theme p-8 sm:p-14 max-w-6xl mx-auto">
        <div className="max-w-2xl space-y-4 mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">
            Real Advantages
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary-theme">
            Built to save your money on every swap.
          </h2>
          <p className="text-sm sm:text-base text-secondary-theme leading-relaxed">
            Legacy decentralized exchanges force you to choose between high gas fees or fragmented pools. SupaDex solves this at the protocol level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-primary-theme flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Lower Network Fees (Gas)
            </div>
            <p className="text-xs sm:text-sm text-secondary-theme leading-relaxed">
              Because all pools share one central vault, multi-hop swaps transfer tokens internally rather than initiating costly ERC-20 blockchain transfers for every step.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-primary-theme flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Protection for Liquidity Providers
            </div>
            <p className="text-xs sm:text-sm text-secondary-theme leading-relaxed">
              Automated dynamic fee protection adjusts costs during violent market swings to keep arbitrage bots from draining earnings away from ordinary pool participants.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-primary-theme flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Frictionless Swap Experience
            </div>
            <p className="text-xs sm:text-sm text-secondary-theme leading-relaxed">
              You choose what token to swap and what token you want. The router automatically searches all initialized pools and delivers the best price automatically.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Live Protocol Telemetry Strip */}
      <ProtocolTelemetry />

      {/* 5. Minimalist CTA Module */}
      <section className="max-w-5xl mx-auto px-4 text-center py-16 border-t border-hairline-theme space-y-6">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary-theme">
          Ready to experience frictionless trading?
        </h2>
        <p className="text-sm sm:text-base text-secondary-theme max-w-xl mx-auto leading-relaxed">
          Connect your wallet and trade with deep liquidity across all curve models with lower gas and automated best-rate execution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
          <a
            href="https://app-supadex.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold bg-primary-theme text-accent-primary-text hover:opacity-90 transition-opacity apple-spring-press shadow-sm"
          >
            <span>Launch App Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <Link
            to="/whitepaper"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium border border-hairline-theme bg-surface-theme/80 hover:bg-subtle-theme text-primary-theme transition-colors apple-spring-press"
          >
            <span>Read the White Paper</span>
            <ChevronRight className="w-4 h-4 text-secondary-theme" />
          </Link>
        </div>
      </section>
    </div>
  );
};
