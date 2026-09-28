import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { CurveType } from '../../utils/ammCurves';
import { formatNumber, formatPercent } from '../../utils/formatters';

interface CurveComparisonCardProps {
  curveType: CurveType;
  liquidityDepth: number;
  amplificationA: number;
  binStep: number;
}

export const CurveComparisonCard: React.FC<CurveComparisonCardProps> = ({
  curveType,
  liquidityDepth,
  amplificationA,
  binStep,
}) => {
  if (curveType === 'clamm') {
    const capitalEfficiency = 4000;
    return (
      <Card
        variant="elevated"
        className="p-5 space-y-4 border border-hairline-theme bg-surface-theme/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-semibold text-base text-primary-theme">
              Concentrated Liquidity (CLAMM)
            </h3>
          </div>
          <Badge variant="success" size="sm">
            Engine Active
          </Badge>
        </div>

        {/* Mathematical Invariant Formula */}
        <div className="p-3 rounded-lg bg-base-theme border border-hairline-theme font-mono text-xs space-y-1">
          <div className="text-secondary-theme flex items-center justify-between">
            <span>Invariant Formula</span>
            <span className="text-[10px] text-tertiary-theme uppercase font-sans">Formula</span>
          </div>
          <div className="text-primary-theme font-semibold text-sm">
            (x + L / &radic;P_b)(y + L &middot; &radic;P_a) = L&sup2;
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
            <div className="text-secondary-theme">
              Capital Efficiency
            </div>
            <div className="text-sm font-bold text-primary-theme font-mono">
              up to {capitalEfficiency}x
            </div>
            <div className="text-[10px] text-tertiary-theme">vs Conventional AMMs</div>
          </div>

          <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
            <div className="text-secondary-theme">
              Active Virtual Depth
            </div>
            <div className="text-sm font-bold text-primary-theme font-mono">
              ${formatNumber(liquidityDepth * 1000)}
            </div>
            <div className="text-[10px] text-tertiary-theme">Concentrated in Range</div>
          </div>
        </div>

        {/* Deep Dive Details */}
        <div className="space-y-2 text-xs text-secondary-theme leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
            <span>
              LPs customize continuous tick ranges $[p_a, p_b]$ with native fee auto-vesting.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
            <span>
              Sub-tick swap routing combined with dynamic LVR spread shield prevents toxic sandwiching.
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (curveType === 'binamm') {
    return (
      <Card
        variant="elevated"
        className="p-5 space-y-4 border border-hairline-theme bg-surface-theme/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <h3 className="font-semibold text-base text-primary-theme">
              Discretized Bin AMM (Liquidity Book)
            </h3>
          </div>
          <Badge variant="curve" size="sm">
            Zero Intra-Bin Slippage
          </Badge>
        </div>

        {/* Mathematical Invariant Formula */}
        <div className="p-3 rounded-lg bg-base-theme border border-hairline-theme font-mono text-xs space-y-1">
          <div className="text-secondary-theme flex items-center justify-between">
            <span>Bin Invariant (Constant Sum)</span>
            <span className="text-[10px] text-tertiary-theme uppercase font-sans">Formula</span>
          </div>
          <div className="text-primary-theme font-semibold text-sm">
            P_i &middot; x + y = L_i (within Bin i)
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
            <div className="text-secondary-theme">
              Intra-Bin Slippage
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              0.000%
            </div>
            <div className="text-[10px] text-tertiary-theme">Pure Constant Sum Execution</div>
          </div>

          <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
            <div className="text-secondary-theme">
              Bin Step Spacing
            </div>
            <div className="text-sm font-bold text-primary-theme font-mono">
              {binStep} bps ({formatPercent(binStep / 10000, 2)})
            </div>
            <div className="text-[10px] text-tertiary-theme">Per Discrete Price Step</div>
          </div>
        </div>

        {/* Deep Dive Details */}
        <div className="space-y-2 text-xs text-secondary-theme leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
            <span>
              Orders within a single bin execute at an exact fixed price, matching central limit order book precision.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
            <span>
              Dynamic volatility accumulation adds surge fees automatically during heavy directional crossing.
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // StableSwap
  return (
    <Card
      variant="elevated"
      className="p-5 space-y-4 border border-hairline-theme bg-surface-theme/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="font-semibold text-base text-primary-theme">
            StableSwap Hybrid Invariant
          </h3>
        </div>
        <Badge variant="info" size="sm">
          A = {amplificationA}
        </Badge>
      </div>

      {/* Mathematical Invariant Formula */}
      <div className="p-3 rounded-lg bg-base-theme border border-hairline-theme font-mono text-xs space-y-1">
        <div className="text-secondary-theme flex items-center justify-between">
          <span>Stableswap Hybrid Formula</span>
          <span className="text-[10px] text-tertiary-theme uppercase font-sans">Formula</span>
        </div>
        <div className="text-primary-theme font-semibold text-sm">
          4A(x + y) + D = 4AD + D&sup3; / (4xy)
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
          <div className="text-secondary-theme">
            Amplification Factor
          </div>
          <div className="text-sm font-bold text-primary-theme font-mono">
            A = {amplificationA}
          </div>
          <div className="text-[10px] text-tertiary-theme">
            {amplificationA >= 200 ? 'Ultra Flat Parity' : 'High Cushion Hybrid'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-elevated-theme/60 border border-hairline-theme space-y-1">
          <div className="text-secondary-theme">
            Expected Peg Slippage
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            &lt; 0.001%
          </div>
          <div className="text-[10px] text-tertiary-theme">For trades &lt; 20% pool TVL</div>
        </div>
      </div>

      {/* Deep Dive Details */}
      <div className="space-y-2 text-xs text-secondary-theme leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
          <span>
            Blends constant-sum $(x+y=D)$ around peg with constant-product $(xy=k)$ for de-peg resilience.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
          <span>
            Optimized with native Newton-Raphson assembly convergence in the SupaDex Vault kernel.
          </span>
        </div>
      </div>
    </Card>
  );
};
