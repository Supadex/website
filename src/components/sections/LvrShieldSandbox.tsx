import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  calculateDynamicLVR,
  LVR_SCENARIO_PRESETS,
} from '../../utils/ammCurves';
import {
  LVRDecayChart,
  DynamicSpreadDial,
  CexDexArbSimulator,
  ParamController,
} from '../visualizers/primitives';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  Activity,
  Play,
  RotateCcw,
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const LvrShieldSandbox: React.FC = () => {
  // Scenario state
  const [activePresetKey, setActivePresetKey] = useState<string>('arb_wave');

  // Interactive parameter states
  const [volatilitySigma, setVolatilitySigma] = useState<number>(0.95);
  const [cexJumpBps, setCexJumpBps] = useState<number>(48);
  const [decayTimeSec, setDecayTimeSec] = useState<number>(6);
  const [tradeSizeUsd, setTradeSizeUsd] = useState<number>(100000);
  const [latencyMs, setLatencyMs] = useState<number>(45);
  const baseFeeBps = 5;

  // Live simulation playback
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Apply scenario preset
  const handleSelectPreset = (key: string) => {
    const preset = LVR_SCENARIO_PRESETS[key];
    if (!preset) return;
    setActivePresetKey(key);
    setVolatilitySigma(preset.volatilitySigma);
    setCexJumpBps(preset.cexJumpBps);
    setDecayTimeSec(preset.decayTimeSec);
    setTradeSizeUsd(preset.tradeSizeUsd);
    setLatencyMs(preset.latencyMs);
    setIsSimulating(false);
  };

  // Run live shock simulation animation
  const triggerShockAnimation = () => {
    setIsSimulating(true);
    setDecayTimeSec(0);
    startTimeRef.current = performance.now();

    const duration = 12000; // 12 seconds simulation duration
    const maxTimeSimulated = 25; // simulate 0 to 25s decay

    const step = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const simulatedTime = progress * maxTimeSimulated;

      setDecayTimeSec(Number(simulatedTime.toFixed(1)));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsSimulating(false);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute live LVR metrics
  const metrics = useMemo(() => {
    return calculateDynamicLVR(
      volatilitySigma,
      cexJumpBps,
      baseFeeBps,
      decayTimeSec,
      tradeSizeUsd,
      latencyMs
    );
  }, [volatilitySigma, cexJumpBps, baseFeeBps, decayTimeSec, tradeSizeUsd, latencyMs]);

  return (
    <section id="lvr-shield" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-hairline-theme">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold">Loss-Versus-Rebalancing Defense</span>
            <span className="text-secondary-theme font-normal">•</span>
            <span className="text-secondary-theme">Anti-MEV Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-theme tracking-tight">
            Dynamic Volatility Decay & LVR Shield
          </h2>
          <p className="text-xs sm:text-sm text-secondary-theme max-w-2xl leading-relaxed">
            Standard AMMs lose up to 70% of pool fee revenue to toxic CEX-DEX arbitrageurs.
            SupaDex uses an exponential volatility decay kernel $\delta(t)$ to neutralize MEV and convert toxic flow into permanent LP yield.
          </p>
        </div>

        {/* Invariant Formula Badge */}
        <div className="flex items-center gap-2 text-xs text-secondary-theme font-mono bg-subtle-theme px-3 py-1.5 rounded-lg border border-hairline-theme shadow-xs">
          <span className="font-semibold text-primary-theme">Kernel:</span>
          <span>δ(t) = δ_base + α·σ·e^(-λt)</span>
        </div>
      </div>

      {/* Scenario Preset Selector & Live Shock Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-hairline-theme bg-surface-theme/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-secondary-theme px-1.5">Market Presets:</span>
          {Object.entries(LVR_SCENARIO_PRESETS).map(([key, preset]) => {
            const isActive = activePresetKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-theme text-accent-primary-text font-semibold shadow-xs'
                    : 'bg-subtle-theme/70 hover:bg-subtle-theme text-secondary-theme hover:text-primary-theme'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={triggerShockAnimation}
          disabled={isSimulating}
          className="flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {isSimulating ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating Decay ({decayTimeSec}s)...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Market Shock</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Simulation Grid: Decay Canvas + Telemetry Gauges + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Time Series Decay Chart + CEX/DEX Arb Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Decay Trajectory Canvas Card */}
          <Card className="p-5 space-y-3.5 border-hairline-theme bg-surface-theme shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-primary-theme">
                  Dynamic Spread Decay Trajectory $\delta(t)$
                </h3>
              </div>
              <span className="text-[11px] font-mono text-secondary-theme">
                Time: <strong className="text-primary-theme">{decayTimeSec}s</strong> elapsed
              </span>
            </div>

            {/* Canvas Curve Plot */}
            <LVRDecayChart
              volatilitySigma={volatilitySigma}
              cexJumpBps={cexJumpBps}
              decayTimeSec={decayTimeSec}
              baseFeeBps={baseFeeBps}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-tertiary-theme pt-1 border-t border-hairline-theme font-mono">
              <span>α = 1.25 (volatility sensitivity)</span>
              <span>λ = 0.16 (half-life ≈ 4.3s)</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Protected Margin: +{(metrics.activeSpreadBps - baseFeeBps).toFixed(1)} bps
              </span>
            </div>

          </Card>

          {/* Interactive CEX vs DEX Arbitrage Flow Simulator */}
          <Card className="p-5 space-y-4 border-hairline-theme bg-surface-theme shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-primary-theme">
                  CEX Shock & Arbitrageur Execution Pipeline
                </h3>
              </div>
              <Badge variant={metrics.activeSpreadBps >= cexJumpBps ? 'success' : 'warning'} size="sm">
                {metrics.activeSpreadBps >= cexJumpBps ? 'Toxic Flow Blocked' : 'Vesting Active'}
              </Badge>
            </div>

            <CexDexArbSimulator
              cexJumpBps={cexJumpBps}
              activeSpreadBps={metrics.activeSpreadBps}
              staticArbLoss={metrics.staticArbLoss}
              dynamicRetainedYield={metrics.dynamicRetainedYield}
              mevProtectionPct={metrics.mevProtectionPct}
              tradeSizeUsd={tradeSizeUsd}
              latencyMs={latencyMs}
              isSimulating={isSimulating}
            />
          </Card>
        </div>

        {/* Right Column (5 cols): Live Telemetry Gauges + Parameter Sliders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Dynamic Gauge & Yield Enhancement Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Dynamic Spread Dial */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-hairline-theme bg-surface-theme shadow-xs">
              <DynamicSpreadDial
                activeSpreadBps={metrics.activeSpreadBps}
                baseFeeBps={baseFeeBps}
                mevProtectionPct={metrics.mevProtectionPct}
                size={200}
              />
            </div>

            {/* Financial Impact Overview Card */}
            <Card className="p-5 flex flex-col justify-between space-y-4 border-hairline-theme bg-surface-theme shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-tertiary-theme uppercase tracking-wider font-semibold">
                    LP Financial Impact
                  </span>
                  <Badge variant="success" size="sm" className="font-mono">
                    +{metrics.lpApyDeltaPct.toFixed(2)}% APY Boost
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-subtle-theme/70 border border-hairline-theme">
                    <span className="text-secondary-theme">Captured per Arbitrage:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      +${formatNumber(metrics.dynamicRetainedYield, 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-subtle-theme/70 border border-hairline-theme">
                    <span className="text-secondary-theme">Arb Searcher Net Yield:</span>
                    <span className="font-mono font-bold text-secondary-theme">
                      ${formatNumber(metrics.arbitrageurNetProfit, 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Permanent Capital Preservation</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 leading-relaxed">
                  Unlike passive AMMs whose LPs suffer irreversible negative selection, SupaDex dynamic pricing retains the rebalancing surplus.
                </p>
              </div>
            </Card>
          </div>

          {/* Parameter Sliders Deck */}
          <Card className="p-5 space-y-4 border-hairline-theme bg-surface-theme shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-hairline-theme">
              <h3 className="text-sm font-bold text-primary-theme flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Interactive Market Sandbox
              </h3>
              <span className="text-[10px] font-mono text-secondary-theme uppercase">Live Inputs</span>
            </div>

            <div className="space-y-4">
              <ParamController
                label="Annualized Volatility (σ)"
                value={Number((volatilitySigma * 100).toFixed(0))}
                min={10}
                max={200}
                step={5}
                unit="%"
                description="Simulated market volatility shock"
                onChange={(val) => setVolatilitySigma(val / 100)}
              />

              <ParamController
                label="CEX Reference Jump"
                value={cexJumpBps}
                min={5}
                max={150}
                step={5}
                unit="bps"
                description="Arbitrage discrepancy magnitude"
                onChange={setCexJumpBps}
              />

              <ParamController
                label="Time Elapsed (t)"
                value={decayTimeSec}
                min={0}
                max={30}
                step={1}
                unit="s"
                description="Exponential spread decay timer"
                onChange={setDecayTimeSec}
              />

              <ParamController
                label="Arb Trade Size"
                value={tradeSizeUsd}
                min={10000}
                max={1000000}
                step={25000}
                unit="USD"
                description="Targeted transaction volume"
                onChange={setTradeSizeUsd}
              />

              <ParamController
                label="Searcher Latency"
                value={latencyMs}
                min={10}
                max={1000}
                step={10}
                unit="ms"
                description="Execution delay from shock timestamp"
                onChange={setLatencyMs}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Architectural Deep Dive: Anti-JIT Fee Vesting & Hook Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl border border-hairline-theme bg-surface-theme/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-theme">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Anti-JIT Fee Vesting</span>
          </div>
          <p className="text-xs text-secondary-theme leading-relaxed">
            Just-In-Time (JIT) bots deposit liquidity in the same block to steal swap fees. SupaDex requires block-age vesting on LP fee claims to neutralize zero-duration liquidity parasites.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-hairline-theme bg-surface-theme/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-theme">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Transient Volatility Oracle</span>
          </div>
          <p className="text-xs text-secondary-theme leading-relaxed">
            Dynamic spreads compute tick variance inside EIP-1153 transient storage (`TSTORE`/`TLOAD`), maintaining zero persistent storage gas overhead during high-frequency volatility waves.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-hairline-theme bg-surface-theme/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-theme">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Dual-Ledger ERC-6909 Claims</span>
          </div>
          <p className="text-xs text-secondary-theme leading-relaxed">
            Internal vault claims settle instantly without ERC-20 transfer overhead, allowing high-frequency arbitrageurs to pay the dynamic spread with zero token approval or transfer friction.
          </p>
        </div>
      </div>
    </section>
  );
};
