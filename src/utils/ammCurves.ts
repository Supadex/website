/**
 * SupaDex Multi-Curve Mathematical Models & Simulation Engine
 * Rigorous formulations for CLAMM (Concentrated), BinAMM (Discretized), and StableAMM (Hybrid invariant).
 */

export type CurveType = 'clamm' | 'binamm' | 'stableamm';

export interface CurvePoint {
  x: number;
  y: number;
}

export interface LiquidityBin {
  id: number;
  price: number;
  reserveX: number;
  reserveY: number;
  totalLiquidity: number;
  isActive: boolean;
}

/**
 * Concentrated Liquidity (CLAMM) xy = k curve generator
 * Generates (x, y) coordinates for a given price range [pMin, pMax] and liquidity L
 */
export function generateCLAMMCurve(
  L = 1000,
  pMin = 0.5,
  pMax = 2.0,
  samples = 80
): CurvePoint[] {
  const points: CurvePoint[] = [];
  const sqrtPMin = Math.sqrt(pMin);
  const sqrtPMax = Math.sqrt(pMax);

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const currentPrice = pMin + t * (pMax - pMin);
    const sqrtP = Math.sqrt(currentPrice);

    // x = L * (1/sqrt(P) - 1/sqrt(P_max))
    // y = L * (sqrt(P) - sqrt(P_min))
    const x = Math.max(0, L * (1 / sqrtP - 1 / sqrtPMax));
    const y = Math.max(0, L * (sqrtP - sqrtPMin));

    points.push({ x, y });
  }

  return points;
}

/**
 * Discretized Bin AMM (Liquidity Book style)
 * Generates discrete bins with zero slippage within each bin
 */
export function generateBinAMMData(
  activePrice = 1.0,
  binStepBps = 20, // 0.20%
  binCount = 17,
  totalLiquidity = 10000
): LiquidityBin[] {
  const bins: LiquidityBin[] = [];
  const halfCount = Math.floor(binCount / 2);
  const stepRatio = 1 + binStepBps / 10000;

  for (let i = -halfCount; i <= halfCount; i++) {
    const binPrice = activePrice * Math.pow(stepRatio, i);
    const isActive = i === 0;
    
    // Normal distribution of liquidity centered at active price
    const dist = Math.exp(-0.5 * Math.pow(i / (halfCount * 0.45), 2));
    const binLiq = totalLiquidity * dist * (0.8 + 0.4 * Math.sin(i * 0.5));

    let reserveX = 0;
    let reserveY = 0;

    if (i > 0) {
      // Bins above current price contain Token X
      reserveX = binLiq / Math.sqrt(binPrice);
    } else if (i < 0) {
      // Bins below current price contain Token Y
      reserveY = binLiq * Math.sqrt(binPrice);
    } else {
      // Active bin contains 50/50 both tokens
      reserveX = (binLiq / Math.sqrt(binPrice)) * 0.5;
      reserveY = (binLiq * Math.sqrt(binPrice)) * 0.5;
    }

    bins.push({
      id: i,
      price: binPrice,
      reserveX,
      reserveY,
      totalLiquidity: binLiq,
      isActive,
    });
  }

  return bins;
}

/**
 * StableSwap Curve Invariant
 * Solves y given x and amplification factor A: A * n^n * sum(x_i) + D = A * D * n^n + D^(n+1) / (n^n * prod(x_i))
 * For n=2: 4A(x + y) + D = 4AD + D^3 / (4xy)
 */
export function generateStableCurve(
  A = 100,
  D = 2000,
  samples = 80
): CurvePoint[] {
  const points: CurvePoint[] = [];
  const minX = D * 0.05;
  const maxX = D * 0.95;

  for (let i = 0; i <= samples; i++) {
    const x = minX + (i / samples) * (maxX - minX);
    // Approximate solution for 2-token StableSwap invariant:
    // When A is large, y ~ D - x (linear). When A -> 0, y ~ D^2 / (4x) (constant product).
    // Interpolation blend based on A
    const linearY = Math.max(0, D - x);
    const cpY = (D * D) / (4 * Math.max(1, x));
    const weight = A / (A + 1);
    
    // Blend with curvature refinement
    const y = weight * linearY + (1 - weight) * cpY;

    if (y > 0 && y < D * 1.5) {
      points.push({ x, y });
    }
  }

  return points;
}

/**
 * Dynamic LVR (Loss-Versus-Rebalancing) Decay Model
 * Calculates real-time spread protection & LP retained yield
 */
export interface LVRMetrics {
  cexPrice: number;
  dexPrice: number;
  staticArbLoss: number;        // Standard AMM loss to arbitrageurs in USD
  dynamicRetainedYield: number; // SupaDex LVR Shield captured for LPs in USD
  activeSpreadBps: number;      // Dynamic fee in basis points at time t
  mevProtectionPct: number;     // 0% - 100%
  arbitrageurNetProfit: number; // Arb bot profit after paying dynamic fee
  lpApyDeltaPct: number;        // Estimated annualized LP yield enhancement
}

export interface LVRDecayPoint {
  t: number;           // Time in seconds
  feeBps: number;      // Dynamic fee in bps
  isMevZone: boolean;  // True if fee > cexJump
}

export interface LVRScenarioPreset {
  id: string;
  name: string;
  description: string;
  volatilitySigma: number;
  cexJumpBps: number;
  decayTimeSec: number;
  tradeSizeUsd: number;
  latencyMs: number;
}

export const LVR_SCENARIO_PRESETS: Record<string, LVRScenarioPreset> = {
  flash_crash: {
    id: 'flash_crash',
    name: 'Flash Crash Shock',
    description: 'Sudden CEX drop with rapid market volatility spike',
    volatilitySigma: 1.8,
    cexJumpBps: 110,
    decayTimeSec: 2,
    tradeSizeUsd: 250000,
    latencyMs: 120,
  },
  arb_wave: {
    id: 'arb_wave',
    name: 'High-Frequency Arb Wave',
    description: 'Fast recurring toxic order flow from MEV searchers',
    volatilitySigma: 0.95,
    cexJumpBps: 48,
    decayTimeSec: 6,
    tradeSizeUsd: 100000,
    latencyMs: 45,
  },
  listing_spike: {
    id: 'listing_spike',
    name: 'Token Listing Frenzy',
    description: 'High retail volume mixed with predatory sandwich bots',
    volatilitySigma: 1.4,
    cexJumpBps: 85,
    decayTimeSec: 4,
    tradeSizeUsd: 175000,
    latencyMs: 200,
  },
  steady_market: {
    id: 'steady_market',
    name: 'Normal Steady Trading',
    description: 'Calm benign volume with organic retail swaps',
    volatilitySigma: 0.35,
    cexJumpBps: 12,
    decayTimeSec: 18,
    tradeSizeUsd: 50000,
    latencyMs: 750,
  },
};

/**
 * Generates continuous time-series points of the dynamic decay curve delta(t)
 */
export function generateLVRDecayCurve(
  volatilitySigma: number,
  cexJumpBps: number,
  baseFeeBps = 5,
  maxTimeSec = 30,
  samples = 60
): LVRDecayPoint[] {
  const points: LVRDecayPoint[] = [];
  const alpha = 1.25;
  const lambda = 0.16;

  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * maxTimeSec;
    const dynamicSpikeBps = alpha * volatilitySigma * 100 * Math.exp(-lambda * t);
    const feeBps = Math.min(160, baseFeeBps + dynamicSpikeBps);
    points.push({
      t,
      feeBps,
      isMevZone: feeBps >= cexJumpBps,
    });
  }

  return points;
}

/**
 * Calculates real-time LVR metrics given market conditions and trade parameters
 */
export function calculateDynamicLVR(
  volatilitySigma: number, // e.g. 0.60 (60% annualized)
  cexJumpBps: number,      // Price jump e.g. 45 bps
  baseFeeBps = 5,          // 0.05% base pool fee
  decayTimeSec = 8,        // Seconds elapsed since volatility spike
  tradeSizeUsd = 100000,   // Swap size in USD
  latencyMs = 100          // Searcher latency
): LVRMetrics {
  // Dynamic spread formula: δ(t) = δ_base + α * σ * e^(-λ * t)
  const alpha = 1.25;
  const lambda = 0.16; // Decay rate
  const dynamicSpikeBps = alpha * volatilitySigma * 100 * Math.exp(-lambda * decayTimeSec);
  const activeSpreadBps = Math.min(160, baseFeeBps + dynamicSpikeBps);

  // Standard AMM Arbitrage Loss (LVR ~ (Delta P - base_fee) * Volume)
  const arbDiscrepancyBps = Math.max(0, cexJumpBps - baseFeeBps);
  const staticArbLoss = (arbDiscrepancyBps / 10000) * tradeSizeUsd;


  // SupaDex Arbitrage capture:
  // When activeSpreadBps >= cexJumpBps, the arb opportunity is completely closed or captured as LP fee
  const effectiveFeePaidBps = activeSpreadBps;
  const potentialArbProfit = (cexJumpBps / 10000) * tradeSizeUsd;
  const feePaidToLp = (effectiveFeePaidBps / 10000) * tradeSizeUsd;

  let dynamicRetainedYield = 0;
  let arbitrageurNetProfit = 0;

  if (effectiveFeePaidBps >= cexJumpBps) {
    // Dynamic fee makes the trade unprofitable for toxic MEV, or forces full fee capture
    dynamicRetainedYield = Math.min(staticArbLoss, potentialArbProfit * 0.95);
    arbitrageurNetProfit = Math.max(0, potentialArbProfit - feePaidToLp);
  } else {
    // Partial capture
    const captureRatio = effectiveFeePaidBps / cexJumpBps;
    dynamicRetainedYield = staticArbLoss * captureRatio;
    arbitrageurNetProfit = Math.max(0, (cexJumpBps - effectiveFeePaidBps) / 10000 * tradeSizeUsd);
  }

  // Adjust for latency decay (faster latency captures more if unprotected)
  const latencyFactor = Math.max(0.5, 1 - latencyMs / 2000);
  const mevProtectionPct = Math.min(
    99.2,
    Math.max(12, (activeSpreadBps / Math.max(activeSpreadBps, cexJumpBps)) * 100 * latencyFactor)
  );

  // Annualized LP yield delta estimate based on 15 daily arb attempts on $5M TVL
  const annualRecapturedUsd = dynamicRetainedYield * 15 * 365;
  const lpApyDeltaPct = Math.min(18.5, (annualRecapturedUsd / 5000000) * 100);

  return {
    cexPrice: 1 + cexJumpBps / 10000,
    dexPrice: 1.0,
    staticArbLoss: Math.round(staticArbLoss),
    dynamicRetainedYield: Math.round(dynamicRetainedYield),
    activeSpreadBps: Number(activeSpreadBps.toFixed(1)),
    mevProtectionPct: Number(mevProtectionPct.toFixed(1)),
    arbitrageurNetProfit: Math.round(arbitrageurNetProfit),
    lpApyDeltaPct: Number(lpApyDeltaPct.toFixed(2)),
  };
}

