import React, { useState, useMemo } from 'react';
import type { CurveType, LiquidityBin } from '../../utils/ammCurves';
import { CurvePlotter } from '../visualizers/primitives/CurvePlotter';
import { BinBarChart } from '../visualizers/primitives/BinBarChart';
import { ParamController } from '../visualizers/primitives/ParamController';
import { CurveComparisonCard } from './CurveComparisonCard';
import { Tabs } from '../ui/Tabs';
import { Card } from '../ui/Card';
import {
  ArrowRightLeft,
  Sliders,
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const MultiCurveDemonstrator: React.FC = () => {
  const [activeCurve, setActiveCurve] = useState<CurveType>('clamm');
  const [tradePointRatio, setTradePointRatio] = useState<number>(0.5);
  const [liquidityDepth, setLiquidityDepth] = useState<number>(1500);
  const [amplificationA, setAmplificationA] = useState<number>(100);
  const [binStep, setBinStep] = useState<number>(20);
  const [selectedBin, setSelectedBin] = useState<LiquidityBin | null>(null);

  // Live swap simulation amount in USD
  const [simulatedSwapUsd, setSimulatedSwapUsd] = useState<number>(10000);

  // Preset Configurations
  const applyPreset = (preset: 'eth_usdc' | 'usdc_usdt' | 'long_tail') => {
    if (preset === 'eth_usdc') {
      setActiveCurve('clamm');
      setLiquidityDepth(2500);
      setTradePointRatio(0.5);
    } else if (preset === 'usdc_usdt') {
      setActiveCurve('stableamm');
      setAmplificationA(350);
      setTradePointRatio(0.5);
    } else if (preset === 'long_tail') {
      setActiveCurve('binamm');
      setBinStep(50);
    }
  };

  // Live swap impact calculation simulation based on active curve
  const swapSimulation = useMemo(() => {
    let outputAmount = 0;
    let priceImpactPct = 0;
    let v2PriceImpactPct = 0;
    let gasUnits = 0;

    const baseTrade = simulatedSwapUsd;

    if (activeCurve === 'clamm') {
      // Concentrated liquidity formula price impact
      const effectiveL = liquidityDepth * 1000;
      priceImpactPct = Math.min(2.5, (baseTrade / (effectiveL * 0.4)) * 0.05);
      v2PriceImpactPct = (baseTrade / 50000) * 0.8;
      outputAmount = baseTrade * (1 - priceImpactPct / 100) * 0.9995; // minus 5 bps fee
      gasUnits = 88400; // Sub-tick routing
    } else if (activeCurve === 'binamm') {
      // Discretized bin AMM: zero slippage within bin, small jump if crossing bin
      const binCapacity = 25000;
      if (baseTrade <= binCapacity) {
        priceImpactPct = 0.0;
      } else {
        const binsCrossed = Math.floor((baseTrade - binCapacity) / 15000) + 1;
        priceImpactPct = binsCrossed * (binStep / 10000) * 100;
      }
      v2PriceImpactPct = (baseTrade / 50000) * 0.8;
      outputAmount = baseTrade * (1 - priceImpactPct / 100) * 0.999;
      gasUnits = 74200; // Bin constant sum execution
    } else {
      // StableSwap: ultra flat curve near peg
      const cushion = amplificationA * 2000;
      priceImpactPct = Math.min(0.08, (baseTrade / cushion) * 0.005);
      v2PriceImpactPct = (baseTrade / 50000) * 0.8;
      outputAmount = baseTrade * (1 - priceImpactPct / 100) * 0.9996; // 4 bps fee
      gasUnits = 69500; // Native assembly Newton-Raphson
    }

    const slippageSavings = Math.max(0, (v2PriceImpactPct - priceImpactPct) * (baseTrade / 100));

    return {
      outputAmount: Number(outputAmount.toFixed(2)),
      priceImpactPct: Number(priceImpactPct.toFixed(4)),
      v2PriceImpactPct: Number(v2PriceImpactPct.toFixed(3)),
      slippageSavings: Number(slippageSavings.toFixed(2)),
      gasUnits,
    };
  }, [activeCurve, liquidityDepth, amplificationA, binStep, simulatedSwapUsd]);

  return (
    <section id="curves" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-hairline-theme">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-secondary-theme uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold">Interactive AMM Simulator</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-theme tracking-tight">
            Multi-Curve Geometric Demonstrator
          </h2>
          <p className="text-secondary-theme text-sm max-w-xl">
            Experience real-time invariant curves, discretized liquidity distribution, and mathematical execution dynamics with live parameter control.
          </p>
        </div>

        {/* Curve Selector Tabs */}
        <Tabs
          tabs={[
            { id: 'clamm', label: 'CLAMM (Concentrated)' },
            { id: 'binamm', label: 'Bin AMM (Discretized)' },
            { id: 'stableamm', label: 'StableSwap (A=100)' },
          ]}
          activeTab={activeCurve}
          onChange={(tab) => setActiveCurve(tab as CurveType)}
        />
      </div>

      {/* Preset Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-hairline-theme bg-surface-theme/60 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-secondary-theme font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Quick Market Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('eth_usdc')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activeCurve === 'clamm'
                ? 'bg-elevated-theme border-[#16a34a] dark:border-[#22c55e] text-primary-theme'
                : 'border-hairline-theme text-secondary-theme hover:text-primary-theme hover:bg-subtle-theme'
            }`}
          >
            ETH / USDC (Concentrated Range)
          </button>

          <button
            onClick={() => applyPreset('usdc_usdt')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activeCurve === 'stableamm'
                ? 'bg-elevated-theme border-blue-500 text-primary-theme'
                : 'border-hairline-theme text-secondary-theme hover:text-primary-theme hover:bg-subtle-theme'
            }`}
          >
            USDC / USDT (Stable Parity A=350)
          </button>

          <button
            onClick={() => applyPreset('long_tail')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activeCurve === 'binamm'
                ? 'bg-elevated-theme border-[#7c3aed] dark:border-[#c084fc] text-primary-theme'
                : 'border-hairline-theme text-secondary-theme hover:text-primary-theme hover:bg-subtle-theme'
            }`}
          >
            Long-Tail / Meme (50 bps Bins)
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Visualizer Canvas & Swap Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visualizer Area */}
          <div className="space-y-4">
            {activeCurve === 'binamm' ? (
              <BinBarChart
                binStepBps={binStep}
                totalLiquidity={liquidityDepth * 30}
                onSelectBin={(bin) => setSelectedBin(bin)}
                selectedBinId={selectedBin?.id}
              />
            ) : (
              <CurvePlotter
                curveType={activeCurve}
                tradePointRatio={tradePointRatio}
                amplification={amplificationA}
                liquidity={liquidityDepth}
              />
            )}
          </div>

          {/* Interactive Trade & Slippage Sandbox Box */}
          <Card
            variant="elevated"
            className="p-5 border border-hairline-theme bg-surface-theme/80 backdrop-blur-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline-theme pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
                <h3 className="font-bold text-sm text-primary-theme">
                  Live Swap Impact & Slippage Sandbox
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary-theme">Simulated Trade:</span>
                <span className="text-xs font-mono font-bold text-primary-theme px-2 py-0.5 rounded bg-base-theme border border-hairline-theme">
                  ${formatNumber(simulatedSwapUsd)} USDC
                </span>
              </div>
            </div>

            {/* Trade Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-secondary-theme font-mono">
                <span>$1,000 (Retail)</span>
                <span>$50,000 (Whale)</span>
                <span>$250,000 (Institutional)</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={simulatedSwapUsd}
                onChange={(e) => setSimulatedSwapUsd(Number(e.target.value))}
                className="w-full accent-[#16a34a] dark:accent-[#22c55e] cursor-pointer"
              />
            </div>

            {/* Simulation Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-base-theme border border-hairline-theme space-y-1">
                <div className="text-secondary-theme">Simulated Output</div>
                <div className="text-sm font-bold font-mono text-primary-theme">
                  ${formatNumber(swapSimulation.outputAmount)}
                </div>
                <div className="text-[10px] text-tertiary-theme">Post-fee token received</div>
              </div>

              <div className="p-3 rounded-xl bg-base-theme border border-hairline-theme space-y-1">
                <div className="text-secondary-theme">SupaDex Price Impact</div>
                <div className="text-sm font-bold font-mono text-[#16a34a] dark:text-[#22c55e]">
                  {swapSimulation.priceImpactPct.toFixed(4)}%
                </div>
                <div className="text-[10px] text-tertiary-theme">vs {swapSimulation.v2PriceImpactPct.toFixed(2)}% on V2</div>
              </div>

              <div className="p-3 rounded-xl bg-base-theme border border-hairline-theme space-y-1">
                <div className="text-secondary-theme">LP Slippage Savings</div>
                <div className="text-sm font-bold font-mono text-[#16a34a] dark:text-[#22c55e]">
                  +${formatNumber(swapSimulation.slippageSavings)}
                </div>
                <div className="text-[10px] text-tertiary-theme">Protected vs standard AMM</div>
              </div>

              <div className="p-3 rounded-xl bg-base-theme border border-hairline-theme space-y-1">
                <div className="text-secondary-theme">Gas Overhead</div>
                <div className="text-sm font-bold font-mono text-[#7c3aed] dark:text-[#c084fc]">
                  ~{formatNumber(swapSimulation.gasUnits)} gas
                </div>
                <div className="text-[10px] text-tertiary-theme">Vault internal ledger</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Mathematical Breakdown & Parameter Controls */}
        <div className="space-y-6">
          {/* Real-time Math & Feature Breakdown Card */}
          <CurveComparisonCard
            curveType={activeCurve}
            liquidityDepth={liquidityDepth}
            amplificationA={amplificationA}
            binStep={binStep}
          />

          {/* Dynamic Curve Controls */}
          <Card className="p-5 space-y-4 border-hairline-theme bg-surface-theme shadow-xs">
            <h3 className="text-sm font-bold text-primary-theme flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
              Curve Parameters
            </h3>

            {activeCurve !== 'binamm' && (
              <ParamController
                label="Trade Price Position"
                value={Number((tradePointRatio * 100).toFixed(0))}
                min={5}
                max={95}
                step={1}
                unit="%"
                description="Move active trade spot along the bonding curve"
                onChange={(val) => setTradePointRatio(val / 100)}
              />
            )}

            <ParamController
              label="Virtual Liquidity (L)"
              value={liquidityDepth}
              min={500}
              max={5000}
              step={100}
              unit=""
              description="Total active depth allocated across price bins"
              onChange={setLiquidityDepth}
            />

            {activeCurve === 'stableamm' && (
              <ParamController
                label="Amplification Factor (A)"
                value={amplificationA}
                min={10}
                max={500}
                step={10}
                unit=""
                description="Curvature tightness around 1.0 peg"
                onChange={setAmplificationA}
              />
            )}

            {activeCurve === 'binamm' && (
              <ParamController
                label="Bin Step"
                value={binStep}
                min={1}
                max={100}
                step={1}
                unit="bps"
                description="Price delta between successive vertical bins"
                onChange={setBinStep}
              />
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
