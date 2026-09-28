import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface LifecycleStage {
  id: string;
  name: string;
  trigger: string;
  category: 'Initialization' | 'Liquidity' | 'Swap Pipeline';
  gasOverhead: string;
  tstoreUsage: string;
  description: string;
  soliditySignature: string;
  safetyCheck: string;
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'beforeSwap',
    name: 'beforeSwap',
    trigger: 'Pre-Swap Execution',
    category: 'Swap Pipeline',
    gasOverhead: '~2.8k gas',
    tstoreUsage: 'TLOAD(LVR_VOLATILITY_SLOT), TSTORE(SWAP_ENTRY_TICK)',
    description: 'Calculates dynamic LVR spread based on real-time Pyth oracle volatility. Inflates fee instantly if a high-speed CEX price shock is detected.',
    soliditySignature: 'function beforeSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external override returns (bytes4, BeforeSwapDelta, uint24 dynamicFee)',
    safetyCheck: 'Validates hook caller == address(poolManager) and transient lock status.',
  },
  {
    id: 'swapCore',
    name: 'PoolManager.swap()',
    trigger: 'Core Settlement Engine',
    category: 'Swap Pipeline',
    gasOverhead: '~18.5k gas',
    tstoreUsage: 'TSTORE(NET_DELTA_CURRENCY0), TSTORE(NET_DELTA_CURRENCY1)',
    description: 'Executes mathematical invariant swap (CLAMM xy=k, Bin discretized bins, or StableSwap x+y=k) and updates internal ERC-6909 delta accounting.',
    soliditySignature: 'function swap(PoolKey memory key, IPoolManager.SwapParams memory params, bytes calldata hookData) external returns (BalanceDelta delta)',
    safetyCheck: 'Enforces balance delta solvency before unlock callback exits.',
  },
  {
    id: 'afterSwap',
    name: 'afterSwap',
    trigger: 'Post-Swap Decay & Sync',
    category: 'Swap Pipeline',
    gasOverhead: '~1.9k gas',
    tstoreUsage: 'TSTORE(LAST_SHOCK_TIMESTAMP), TSTORE(LAST_IMPACT_DEPTH)',
    description: 'Records final execution tick and triggers exponential decay timer ($t_{1/2} = 12s$) to return spread to baseline fee.',
    soliditySignature: 'function afterSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, BalanceDelta delta, bytes calldata hookData) external override returns (bytes4, int128)',
    safetyCheck: 'Ensures zero delta divergence; reverts if unauthorized hook data injected.',
  },
  {
    id: 'beforeAddLiquidity',
    name: 'beforeAddLiquidity',
    trigger: 'Liquidity Provision Check',
    category: 'Liquidity',
    gasOverhead: '~3.1k gas',
    tstoreUsage: 'TSTORE(LP_ENTRY_BLOCK), TLOAD(BLOCK_NUMBER)',
    description: 'Registers deposit block number and assigns linear fee vesting lock (5 blocks) to prevent Just-In-Time (JIT) MEV extraction.',
    soliditySignature: 'function beforeAddLiquidity(address sender, PoolKey calldata key, IPoolManager.ModifyLiquidityParams calldata params, bytes calldata hookData) external override returns (bytes4)',
    safetyCheck: 'Enforces pool key permissions and tick range alignment.',
  },
  {
    id: 'beforeInitialize',
    name: 'beforeInitialize',
    trigger: 'Pool Instantiation',
    category: 'Initialization',
    gasOverhead: '~4.2k gas',
    tstoreUsage: 'SSTORE(INITIAL_CURVE_CONFIG), SSTORE(BASE_FEE_BPS)',
    description: 'Sets baseline invariant parameters (CLAMM tick spacing, Bin step, or StableSwap amplification factor A) and binds dynamic hook contracts.',
    soliditySignature: 'function beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, bytes calldata hookData) external override returns (bytes4)',
    safetyCheck: 'Verifies non-zero address, valid tick spacing, and verified fee parameters.',
  },
];

export const HookLifecycleVisualizer: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('beforeSwap');
  const activeStage = LIFECYCLE_STAGES.find(s => s.id === activeStageId) || LIFECYCLE_STAGES[0];

  return (
    <Card className="p-6 border-hairline-theme bg-surface-theme space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline-theme">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="font-semibold text-primary-theme text-sm tracking-tight">
              Hook Execution Pipeline
            </h3>
          </div>
          <p className="text-xs text-secondary-theme">
            Step-by-step transaction flow with EIP-1153 transient memory layout and gas benchmarks.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-[11px] self-start sm:self-auto text-secondary-theme">
          EIP-1153 Native Dispatch
        </Badge>
      </div>

      {/* Stage Selector Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {LIFECYCLE_STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3 rounded-lg border text-left transition-all apple-spring-press cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-subtle-theme border-emerald-500 shadow-sm'
                  : 'bg-surface-theme border-hairline-theme hover:border-border-theme'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary-theme">
                  {stage.category}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <div>
                <span className={`font-mono text-xs font-bold block truncate ${
                  isActive ? 'text-primary-theme' : 'text-secondary-theme'
                }`}>
                  {stage.name}
                </span>
                <span className="text-[10px] text-tertiary-theme font-mono">
                  {stage.gasOverhead}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Card */}
      <div className="p-5 rounded-xl bg-subtle-theme border border-hairline-theme space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-primary-theme font-mono">{activeStage.name}</h4>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {activeStage.gasOverhead}
              </Badge>
            </div>
            <p className="text-xs text-secondary-theme mt-1">{activeStage.description}</p>
          </div>
          <div className="text-[11px] font-mono text-tertiary-theme bg-surface-theme px-3 py-1.5 rounded border border-hairline-theme shrink-0">
            Trigger: {activeStage.trigger}
          </div>
        </div>

        {/* Transient Storage Key & Safety Check */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-surface-theme border border-hairline-theme space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary-theme">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Transient Storage Access (EIP-1153)</span>
            </div>
            <code className="text-[11px] font-mono text-secondary-theme block break-all">
              {activeStage.tstoreUsage}
            </code>
          </div>

          <div className="p-3 rounded-lg bg-surface-theme border border-hairline-theme space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary-theme">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>In-Line Security Assertion</span>
            </div>
            <p className="text-[11px] text-secondary-theme">
              {activeStage.safetyCheck}
            </p>
          </div>
        </div>

        {/* Solidity Interface Signature */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-tertiary-theme uppercase tracking-wider font-mono">
            Solidity Hook Signature
          </span>
          <div className="p-3 rounded-lg bg-[#08090b] text-[#e2e8f0] font-mono text-xs overflow-x-auto border border-white/10 shadow-inner">
            <code className="text-emerald-400">{activeStage.soliditySignature}</code>
          </div>
        </div>
      </div>
    </Card>
  );
};
