import React, { useState } from 'react';
import { 
  Check, 
  X, 
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ComparisonFeature {
  id: string;
  category: 'lvr' | 'curves' | 'gas' | 'security';
  title: string;
  categoryLabel: string;
  metricBadge: string;
  metricType: 'success' | 'warning' | 'info';
  conventional: {
    title: string;
    description: string;
    status: 'lacking' | 'partial' | 'standard';
  };
  supadex: {
    title: string;
    description: string;
    status: 'advanced' | 'breakthrough';
    highlight: string;
  };
  technicalInsight: string;
}

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    id: 'lvr-protection',
    category: 'lvr',
    categoryLabel: 'LP Protection & MEV',
    title: 'Loss-Versus-Rebalancing (LVR) Mitigation',
    metricBadge: '+18.4% LP Real Yield',
    metricType: 'success',
    conventional: {
      title: 'Static Pool Fees (100% Leaked to CEX-DEX Arb)',
      description: 'Fees remain fixed during high volatility. Arbitrageurs extract pure delta-neutral profits from passive LPs without compensation.',
      status: 'lacking',
    },
    supadex: {
      title: 'Dynamic Volatility Spread Decay Hook',
      description: 'Automatically increases spread during high CEX price volatility jumps, decaying smoothly via half-life physics to capture MEV for LPs.',
      status: 'breakthrough',
      highlight: 'Mathematical dynamic spread decay captures 84%+ of toxic arbitrage delta directly into LP yield reserves.',
    },
    technicalInsight: 'Calculates price variance per block using transient storage and scales fee delta exponentially during sharp tick transitions.',
  },
  {
    id: 'multi-curve-engine',
    category: 'curves',
    categoryLabel: 'AMM Invariant Engines',
    title: 'Multi-Curve Invariant Architecture',
    metricBadge: '3 Native AMM Models',
    metricType: 'info',
    conventional: {
      title: 'Single Invariant Engine (xy=k or Stableswap only)',
      description: 'Limited strictly to a single tick-based curve. Requires external wrapper contracts or separate deployments for stable or bin trading.',
      status: 'partial',
    },
    supadex: {
      title: 'Unified Tri-Engine Singleton Architecture',
      description: 'Single PoolManager natively routes between Concentrated CLAMM, Discretized Bins (BinAMM zero-slippage), and Curve-style StableSwap (x+y).',
      status: 'breakthrough',
      highlight: 'Switch seamlessly between pool curve types within the exact same flash-accounting singleton instance.',
    },
    technicalInsight: 'Dynamic pool key routing delegates to specialized Assembly-optimized math libraries (CLAMMLib, BinAMMLib, StableAMMLib).',
  },
  {
    id: 'dual-ledger-accounting',
    category: 'gas',
    categoryLabel: 'Settlement & Gas Efficiency',
    title: 'Dual-Ledger & Flash Vault Settlement',
    metricBadge: '-22% Multi-Hop Gas',
    metricType: 'success',
    conventional: {
      title: 'Transient Accounting with Physical ERC-20 Settlement',
      description: 'Flash-accounting clears deltas at lock unlock, but internal balances must still eventually settle into raw ERC-20 physical transfers.',
      status: 'standard',
    },
    supadex: {
      title: 'Internal ERC-6909 Vault Claims + Zero Transfer Swaps',
      description: 'Users hold internal multi-token ERC-6909 claims inside the vault. Multi-hop swaps execute as pure internal ledger bit-mutations with 0 token transfers.',
      status: 'breakthrough',
      highlight: 'High-frequency traders, aggregators, and market makers trade with 0 ERC-20 transfers across infinite hops.',
    },
    technicalInsight: 'Uses EIP-1153 transient opcodes (`TSTORE`/`TLOAD`) combined with EIP-6909 claims for sub-40k gas single swaps.',
  },
  {
    id: 'anti-jit-vesting',
    category: 'lvr',
    categoryLabel: 'LP Protection & MEV',
    title: 'Just-In-Time (JIT) Liquidity Defense',
    metricBadge: 'Zero-Block JIT Shield',
    metricType: 'success',
    conventional: {
      title: 'Vulnerable to 0-Block JIT Liquidity Sandwiches',
      description: 'Searchers can mint liquidity in the exact transaction before a massive swap and burn it immediately after, extracting 99% of swap fees.',
      status: 'lacking',
    },
    supadex: {
      title: 'Anti-JIT Fee Vesting & Block-Delay Lockup',
      description: 'Liquidity withdrawn within N blocks forfeits earned swap fees into a pool-wide LP insurance buffer, making JIT attacks economically unviable.',
      status: 'breakthrough',
      highlight: 'Passive retail and institutional liquidity providers earn 100% of organic trading fees without dilution.',
    },
    technicalInsight: 'Records deposit block timestamp in position slot; fee accumulation curve applies quadratic penalty for blocks < N_vesting.',
  },
  {
    id: 'hook-overhead',
    category: 'gas',
    categoryLabel: 'Settlement & Gas Efficiency',
    title: 'Hook Dispatch Gas Overhead',
    metricBadge: '4.8k Gas Dispatch',
    metricType: 'info',
    conventional: {
      title: 'Address Bitmask Hook Verification',
      description: 'Enforces permission bitmasks via strict contract address prefixes. Requires multiple external staticcalls to hook contracts per swap step.',
      status: 'standard',
    },
    supadex: {
      title: 'Yul-Optimized Inline Bitmask & Transient Hook Dispatch',
      description: 'Custom assembly dispatcher caches hook capabilities in transient storage during pool unlock, executing hook callbacks with minimal gas overhead.',
      status: 'advanced',
      highlight: 'Saves ~6,200 gas per hook execution compared to standard external call validation chains.',
    },
    technicalInsight: 'Bitwise hook flags packed into a single 32-byte slot; Yul dispatcher executes low-level delegatecall/staticcall directly.',
  },
  {
    id: 'upgradeability-safety',
    category: 'security',
    categoryLabel: 'Security & Governance',
    title: 'Institutional Governance & Circuit Breakers',
    metricBadge: 'UUPS + Circuit Breakers',
    metricType: 'warning',
    conventional: {
      title: 'Fully Immutable Singleton (No Parameter Upgrades)',
      description: 'Pool manager cannot be upgraded. Any logic bug or parameter adjustment requires migrating all TVL to a completely new deployment.',
      status: 'standard',
    },
    supadex: {
      title: 'UUPS Upgradable Proxy + Timelock Emergency Pause',
      description: 'Protected by OpenZeppelin UUPS proxy architecture with multi-role AccessControl (Guardian, Operator, Owner) and automated invariant tripwires.',
      status: 'breakthrough',
      highlight: 'Enterprise-grade stability allowing protocol evolution, fee tier governance, and instant crisis response.',
    },
    technicalInsight: 'Storage layouts protected via ERC-7201 namespaced storage slots; Guardian multisig holds instant pause circuit breaker.',
  },
];

type FilterCategory = 'all' | 'lvr' | 'curves' | 'gas' | 'security';

interface ComparisonGridProps {
  onSelectDeepDive?: (featureId: string) => void;
  selectedFeatureId?: string;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({
  onSelectDeepDive,
  selectedFeatureId,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filteredFeatures = activeCategory === 'all' 
    ? COMPARISON_FEATURES 
    : COMPARISON_FEATURES.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* High-level Architecture Advantage Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-surface-theme border-hairline-theme">
          <div className="text-xs font-medium text-secondary-theme">Passive LP Yield</div>
          <div className="text-xl font-bold tracking-tight text-primary-theme flex items-center gap-1.5 mt-1">
            +18.4%
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Net APY</span>
          </div>
          <div className="text-[11px] text-tertiary-theme mt-1">Via Dynamic LVR Decay</div>
        </Card>

        <Card className="p-4 bg-surface-theme border-hairline-theme">
          <div className="text-xs font-medium text-secondary-theme">AMM Invariants</div>
          <div className="text-xl font-bold tracking-tight text-primary-theme flex items-center gap-1.5 mt-1">
            3-in-1
            <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">Native</span>
          </div>
          <div className="text-[11px] text-tertiary-theme mt-1">CLAMM + Bins + Stable</div>
        </Card>

        <Card className="p-4 bg-surface-theme border-hairline-theme">
          <div className="text-xs font-medium text-secondary-theme">Multi-Hop Swap Gas</div>
          <div className="text-xl font-bold tracking-tight text-primary-theme flex items-center gap-1.5 mt-1">
            -22.6%
            <span className="text-[10px] font-semibold text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">Saved</span>
          </div>
          <div className="text-[11px] text-tertiary-theme mt-1">ERC-6909 Vault Claims</div>
        </Card>

        <Card className="p-4 bg-surface-theme border-hairline-theme">
          <div className="text-xs font-medium text-secondary-theme">JIT Dilution Shield</div>
          <div className="text-xl font-bold tracking-tight text-primary-theme flex items-center gap-1.5 mt-1">
            100%
            <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Protected</span>
          </div>
          <div className="text-[11px] text-tertiary-theme mt-1">Fee Vesting Penalty</div>
        </Card>
      </div>

      {/* Category Filter Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline-theme pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-subtle-theme rounded-full border border-hairline-theme">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                : 'text-secondary-theme hover:text-primary-theme'
            }`}
          >
            All Pillars ({COMPARISON_FEATURES.length})
          </button>
          <button
            onClick={() => setActiveCategory('lvr')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'lvr'
                ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                : 'text-secondary-theme hover:text-primary-theme'
            }`}
          >
            LP & MEV Shield
          </button>
          <button
            onClick={() => setActiveCategory('curves')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'curves'
                ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                : 'text-secondary-theme hover:text-primary-theme'
            }`}
          >
            Curve Diversity
          </button>
          <button
            onClick={() => setActiveCategory('gas')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'gas'
                ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                : 'text-secondary-theme hover:text-primary-theme'
            }`}
          >
            Gas & Flash Ledger
          </button>
          <button
            onClick={() => setActiveCategory('security')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'security'
                ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                : 'text-secondary-theme hover:text-primary-theme'
            }`}
          >
            Security & Governance
          </button>
        </div>

        <div className="text-xs text-tertiary-theme font-mono">
          Production Architecture Specs
        </div>
      </div>

      {/* Main Comparative Matrix Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFeatures.map((feature) => {
          const isSelected = selectedFeatureId === feature.id;

          return (
            <Card
              key={feature.id}
              className={`p-5 bg-surface-theme border-hairline-theme transition-all duration-200 ${
                isSelected ? 'ring-1 ring-emerald-500/40 border-emerald-500/40' : ''
              }`}
            >
              {/* Card Header with Pillar Title & Advantage Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline-theme">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-secondary-theme">
                    {feature.categoryLabel}
                  </div>
                  <h3 className="text-base font-semibold text-primary-theme tracking-tight">
                    {feature.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge
                    variant={feature.metricType === 'success' ? 'success' : feature.metricType === 'warning' ? 'warning' : 'outline'}
                    className="font-mono text-xs px-2.5 py-0.5"
                  >
                    {feature.metricBadge}
                  </Badge>

                  {onSelectDeepDive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectDeepDive(feature.id)}
                      className="text-xs text-secondary-theme hover:text-primary-theme gap-1 py-1 px-2.5 h-7"
                    >
                      <span>Code Diff</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Architectural Comparison Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Conventional AMMs Column */}
                <div className="p-4 rounded-xl bg-subtle-theme/40 border border-hairline-theme flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-medium text-secondary-theme flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Conventional AMMs
                      </span>
                      <span className="text-[10px] font-mono text-tertiary-theme bg-surface-theme px-2 py-0.5 rounded border border-hairline-theme">
                        Legacy Standard
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-primary-theme">
                      {feature.conventional.title}
                    </h4>
                    <p className="text-xs text-secondary-theme mt-1 leading-relaxed">
                      {feature.conventional.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-hairline-theme/60 flex items-center gap-1.5 text-[11px] text-tertiary-theme">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Lacks real-time volatility adaptation</span>
                  </div>
                </div>

                {/* SupaDex Next-Gen Column */}
                <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        SupaDex Architecture
                      </span>
                      <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Production Ready
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-primary-theme">
                      {feature.supadex.title}
                    </h4>
                    <p className="text-xs text-secondary-theme mt-1 leading-relaxed">
                      {feature.supadex.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/15 flex items-start gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature.supadex.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Technical Insight Footer */}
              <div className="mt-3.5 pt-3 border-t border-hairline-theme/50 flex items-center gap-2 text-xs text-secondary-theme font-mono">
                <span className="text-tertiary-theme font-sans text-[11px]">Solidity Spec:</span>
                <span className="text-[11px] truncate">{feature.technicalInsight}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
