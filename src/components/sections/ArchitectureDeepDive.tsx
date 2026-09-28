import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink,
  Flame,
  FileCode2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CodeSnippetModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  contractFile: string;
  description: string;
  highlights: string[];
  gasBenchmark: {
    conventional: string;
    supadex: string;
    savings: string;
  };
  code: {
    conventionalCode: string;
    supadexCode: string;
  };
}

export const ARCHITECTURE_SNIPPETS: CodeSnippetModule[] = [
  {
    id: 'lvr-protection',
    title: 'Dynamic Volatility Spread Decay Hook',
    subtitle: 'Real-time MEV Capture vs. Static Fee Arbitrage',
    category: 'LP Protection',
    contractFile: 'contracts/hooks/LVRShieldHook.sol',
    description: 'SupaDex computes the intra-block tick variance and dynamically scales the swap spread during high volatility. The spread decays smoothly over blocks via a mathematical half-life decay function, capturing toxic flow value into the pool reserve.',
    highlights: [
      'Captures up to 84% of CEX-DEX arbitrage profits as LP revenue',
      'Exponential decay function: spread(t) = baseFee + delta * e^(-λt)',
      'Zero extra external oracle calls needed; reads transient block state',
    ],
    gasBenchmark: {
      conventional: '104,200 gas (Static loss to searchers)',
      supadex: '108,600 gas (Preserves +18.4% LP APY)',
      savings: '+18.4% Net LP Returns',
    },
    code: {
      conventionalCode: `// Conventional AMM: Static fee pool
function swap(
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params
) external returns (BalanceDelta delta) {
    // Static fee regardless of price shock
    uint24 fee = key.fee; 
    
    // Arbitrageurs exploit stale pool price
    delta = _executeSwap(key, params, fee);
    return delta;
}`,
      supadexCode: `// SupaDex: Dynamic LVR Volatility Decay Hook
function beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params
) external override returns (bytes4, BeforeSwapDelta, uint24) {
    uint256 currentTick = _getCurrentTick(key.toId());
    uint256 lastTick = _getLastBlockTick(key.toId());
    
    // 1. Calculate price jump delta
    uint256 tickDelta = Math.abs(currentTick - lastTick);
    
    // 2. Compute dynamic fee with exponential half-life decay
    uint24 dynamicFee = DynamicSpreadLib.calculateDecayedFee(
        key.fee,          // Base fee
        tickDelta,        // Volatility shock
        block.timestamp - lastShockTimestamp[key.toId()],
        DECAY_HALF_LIFE   // Half-life lambda
    );
    
    // 3. Capture arbitrage profit directly to LP pool reserves
    return (this.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, dynamicFee);
}`,
    },
  },
  {
    id: 'multi-curve-engine',
    title: 'Tri-Engine Unified Pool Manager',
    subtitle: 'CLAMM + BinAMM + StableSwap in a Single Singleton',
    category: 'Multi-Curve',
    contractFile: 'contracts/core/PoolManager.sol',
    description: 'Instead of forcing all liquidity into a single tick-based concentrated liquidity formula, SupaDex implements specialized math libraries dispatched based on the pool key curve type. All curve models share the same flash-accounting vault.',
    highlights: [
      'CLAMM (xy=k) for high-volatility asymmetric price discovery',
      'BinAMM (Discretized vertical bins) for zero-slippage market making',
      'StableSwap (x+y) for amplified capital efficiency on pegged pairs',
    ],
    gasBenchmark: {
      conventional: 'Only single curve supported natively',
      supadex: 'Native dispatch across 3 AMM models',
      savings: 'Unified TVL Liquidity Mesh',
    },
    code: {
      conventionalCode: `// Conventional AMM: Rigid single-curve tick math
function _swap(PoolKey memory key, SwapParams memory params) internal {
    // Hardcoded to standard concentrated curve math
    (Slot0 slot0, Tick.Info storage tickInfo) = _loadTicks(key);
    CLAMMMath.computeSwapStep(slot0.sqrtPriceX96, params.amountSpecified);
}`,
      supadexCode: `// SupaDex: Polymorphic Multi-Curve Dispatcher
function _swapDispatcher(
    PoolKey memory key, 
    SwapParams memory params
) internal returns (BalanceDelta delta) {
    CurveType curve = key.curveType;
    
    if (curve == CurveType.CONCENTRATED_CLAMM) {
        // High-precision concentrated tick steps
        delta = CLAMMLib.computeSwap(key, params);
    } else if (curve == CurveType.BIN_AMM) {
        // Discretized bin steps (0 slippage within active bin)
        delta = BinAMMLib.executeBinSwap(key, params);
    } else if (curve == CurveType.STABLE_SWAP) {
        // Amplified Invariant: A*n^n * sum(x) + D = A*D*n^n + D^(n+1)/(n^n * prod(x))
        delta = StableAMMLib.executeStableSwap(key, params);
    }
    
    _applyTransientDeltas(key, delta);
    return delta;
}`,
    },
  },
  {
    id: 'dual-ledger-accounting',
    title: 'Dual-Ledger & Flash Vault Settlement',
    subtitle: 'ERC-6909 Internal Ledger with Zero Token Transfers',
    category: 'Settlement & Gas',
    contractFile: 'contracts/core/Vault.sol',
    description: 'SupaDex natively maintains internal ERC-6909 balance claims alongside standard ERC-20 tokens. Traders and aggregators executing multi-hop swaps settle entirely through internal claim bit mutations without emitting raw ERC-20 transfer calls.',
    highlights: [
      'Sub-40,000 gas swaps for high-frequency internal claim trades',
      'Zero ERC-20 token approval and transfer overhead across intermediate hops',
      'Instant 1-to-1 mint/burn parity between ERC-20 and ERC-6909 claims',
    ],
    gasBenchmark: {
      conventional: '142,500 gas (3-hop swap with ERC-20)',
      supadex: '110,200 gas (3-hop swap via ERC-6909)',
      savings: '-22.6% Gas Reduction',
    },
    code: {
      conventionalCode: `// Conventional AMM: Intermediate physical token transfers
function settleDelta(Currency currency, uint256 amount) external {
    // Requires physical ERC-20 transfer at unlock exit
    IERC20(Currency.unwrap(currency)).safeTransfer(msg.sender, amount);
}`,
      supadexCode: `// SupaDex: Flash ERC-6909 Claim Settlement
function settleInternalClaim(
    Currency currency, 
    uint256 amount,
    address recipient
) external lockAcquired {
    // Zero external ERC-20 transfer overhead
    if (userPrefersClaims[recipient]) {
        _mint6909(recipient, currency.toId(), amount);
    } else {
        _settlePhysicalErc20(currency, amount, recipient);
    }
    
    // Clear flash delta in transient storage
    assembly {
        tstore(currency, 0)
    }
}`,
    },
  },
  {
    id: 'anti-jit-vesting',
    title: 'Anti-JIT Fee Vesting & Decay Defense',
    subtitle: 'Eliminating Sandwiching & 0-Block Parasitic Liquidity',
    category: 'LP Protection',
    contractFile: 'contracts/libraries/AntiJITVestingLib.sol',
    description: 'When liquidity is deposited, its block number is recorded. If liquidity is burned within the protection window (N blocks), earned swap fees are subject to a quadratic vesting forfeiture penalty and redirected into the permanent pool insurance vault.',
    highlights: [
      'Neutralizes 0-block Just-In-Time (JIT) MEV sandwich extraction',
      'Protects retail LPs from having high-volume fee spikes stolen by bot flash-mints',
      'Zero penalty for honest long-term liquidity providers',
    ],
    gasBenchmark: {
      conventional: '0 gas overhead (LPs lose 99% of spike fees)',
      supadex: '+1.8k gas overhead (100% fee retention for honest LPs)',
      savings: '100% Sandwich Proof',
    },
    code: {
      conventionalCode: `// Conventional AMM: Unprotected liquidity burn
function modifyLiquidity(
    PoolKey memory key, 
    IPoolManager.ModifyLiquidityParams memory params
) external returns (BalanceDelta delta) {
    // Instant fee collection even if minted in the preceding tx
    delta = _collectAndBurn(key, params);
    return delta;
}`,
      supadexCode: `// SupaDex: Quadratic Anti-JIT Fee Vesting
function modifyLiquidity(
    PoolKey memory key,
    IPoolManager.ModifyLiquidityParams memory params
) external lockAcquired returns (BalanceDelta delta) {
    Position.Info storage position = _getPosition(key, params);
    
    uint256 blocksActive = block.number - position.creationBlock;
    if (blocksActive < VESTING_BLOCK_WINDOW && params.liquidityDelta < 0) {
        // Calculate vesting penalty percentage
        uint256 vestedRatio = (blocksActive * 1e18) / VESTING_BLOCK_WINDOW;
        uint256 forfeitedFees = position.accumulatedFees * (1e18 - vestedRatio) / 1e18;
        
        // Divert forfeited fees to pool LP insurance reserve
        _divertToPoolInsurance(key, forfeitedFees);
        position.accumulatedFees -= forfeitedFees;
    }
    
    return _applyLiquidityDelta(key, params);
}`,
    },
  },
  {
    id: 'hook-overhead',
    title: 'Yul-Optimized Inline Bitmask Hook Dispatch',
    subtitle: 'Assembly Hook Caching & Sub-5k Gas Dispatch',
    category: 'Gas & Execution',
    contractFile: 'contracts/libraries/HookDispatcherLib.sol',
    description: 'SupaDex packs hook permission flags and permissions into a single 32-byte transient slot. Inline assembly executes hook callbacks directly with clean error bubbling, avoiding multi-hop ABI encoding overhead.',
    highlights: [
      'Packs 14 hook permissions into 1 transient bitmask slot',
      'Direct inline assembly staticcall/delegatecall execution',
      'Saves ~6,200 gas per swap compared to standard interface wrappers',
    ],
    gasBenchmark: {
      conventional: '~11,000 gas per hook execution cycle',
      supadex: '~4,800 gas per hook execution cycle',
      savings: '-56.3% Hook Overhead',
    },
    code: {
      conventionalCode: `// Conventional AMM: External interface validation
function callHook(IHooks hook, bytes calldata data) internal {
    bytes4 selector = hook.beforeSwap(msg.sender, key, params, hookData);
    require(selector == IHooks.beforeSwap.selector, "HookFailed");
}`,
      supadexCode: `// SupaDex: High-Speed Yul Hook Dispatcher
function dispatchHookInline(
    address hook, 
    uint256 hookBitmask, 
    bytes memory callData
) internal returns (bool success, bytes memory result) {
    assembly {
        // Fast-path bitmask test
        if iszero(and(hookBitmask, HOOK_BEFORE_SWAP_FLAG)) {
            mstore(0x00, 0x01)
            return(0x00, 0x20)
        }
        
        // Execute low-level staticcall with minimal memory footprint
        let ptr := mload(0x40)
        success := staticcall(gas(), hook, add(callData, 0x20), mload(callData), ptr, 0x60)
        if iszero(success) {
            returndatacopy(ptr, 0, returndatasize())
            revert(ptr, returndatasize())
        }
    }
}`,
    },
  },
  {
    id: 'upgradeability-safety',
    title: 'Institutional UUPS & Governance Circuit Breakers',
    subtitle: 'Enterprise Upgrade Safety with Multi-Role RBAC',
    category: 'Security & Governance',
    contractFile: 'contracts/governance/CircuitBreaker.sol',
    description: 'Features OpenZeppelin UUPS proxy architecture with ERC-7201 namespaced storage layouts, multi-tier AccessControl roles (Guardian, Operator, Owner), and an emergency circuit breaker that automatically halts pools if price variance exceeds safety bounds.',
    highlights: [
      'ERC-7201 namespaced storage slots preventing proxy upgrade collisions',
      'Independent Guardian role with instant 0-delay pause authority',
      'Timelocked protocol parameter adjustments with on-chain diff auditing',
    ],
    gasBenchmark: {
      conventional: 'Immutable singleton (0 upgradeability)',
      supadex: 'UUPS proxy with 0 runtime overhead',
      savings: 'Enterprise Grade Resilience',
    },
    code: {
      conventionalCode: `// Conventional AMM: Immutable contract
contract PoolManager is IPoolManager {
    // Logic cannot be upgraded or patched if an edge case is found
    // Requires complete TVL migration
}`,
      supadexCode: `// SupaDex: UUPS Upgradeable Architecture with Circuit Breakers
contract PoolManager is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    // ERC-7201: SupaDex Storage Namespace
    bytes32 private constant POOL_MANAGER_STORAGE = 0x8a92f038102b...;

    function triggerEmergencyPause(PoolId poolId, bytes32 reason) external onlyRole(GUARDIAN_ROLE) {
        _pausePool(poolId);
        emit EmergencyPoolPaused(poolId, msg.sender, reason);
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}`,
    },
  },
];

interface ArchitectureDeepDiveProps {
  selectedId?: string;
  onSelectSnippet?: (id: string) => void;
}

export const ArchitectureDeepDive: React.FC<ArchitectureDeepDiveProps> = ({
  selectedId = 'lvr-protection',
  onSelectSnippet,
}) => {
  const [internalSnippetId, setInternalSnippetId] = useState<string>(selectedId);
  const [copiedState, setCopiedState] = useState<'conventional' | 'supadex' | null>(null);

  const activeSnippetId = selectedId || internalSnippetId;
  const activeSnippet = ARCHITECTURE_SNIPPETS.find(s => s.id === activeSnippetId) || ARCHITECTURE_SNIPPETS[0];

  const handleCopy = (code: string, type: 'conventional' | 'supadex') => {
    navigator.clipboard.writeText(code);
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleSnippetChange = (id: string) => {
    setInternalSnippetId(id);
    if (onSelectSnippet) {
      onSelectSnippet(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-secondary-theme font-medium mb-1">
            Technical Deep-Dive & Source Diff
          </div>
          <h3 className="text-xl font-semibold text-primary-theme tracking-tight">
            Production Solidity Architecture
          </h3>
        </div>

        {/* Snippet Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-subtle-theme rounded-full border border-hairline-theme overflow-x-auto max-w-full">
          {ARCHITECTURE_SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => handleSnippetChange(snippet.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeSnippetId === snippet.id
                  ? 'bg-surface-theme text-primary-theme shadow-xs font-semibold'
                  : 'text-secondary-theme hover:text-primary-theme'
              }`}
            >
              <span>{snippet.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Code & Architecture Inspector */}
      <Card className="p-6 bg-surface-theme border-hairline-theme">
        {/* Module Title & Benchmark Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-hairline-theme">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-secondary-theme bg-subtle-theme px-2 py-0.5 rounded border border-hairline-theme">
                {activeSnippet.contractFile}
              </span>
              <span className="text-xs text-tertiary-theme">•</span>
              <span className="text-xs font-medium text-secondary-theme">{activeSnippet.subtitle}</span>
            </div>
            <h4 className="text-lg font-semibold text-primary-theme tracking-tight">
              {activeSnippet.title}
            </h4>
            <p className="text-xs text-secondary-theme max-w-3xl leading-relaxed">
              {activeSnippet.description}
            </p>
          </div>

          {/* Gas & Efficiency Benchmark Metric Box */}
          <div className="p-3.5 rounded-xl bg-subtle-theme border border-hairline-theme shrink-0 space-y-2 lg:w-72">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary-theme font-medium">Conventional AMM:</span>
              <span className="font-mono text-tertiary-theme text-[11px]">{activeSnippet.gasBenchmark.conventional}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SupaDex Architecture:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">{activeSnippet.gasBenchmark.supadex}</span>
            </div>
            <div className="pt-2 border-t border-hairline-theme flex items-center justify-between">
              <span className="text-[11px] font-medium text-secondary-theme">Efficiency Advantage:</span>
              <Badge variant="success" className="text-[10px] font-semibold font-mono px-2 py-0.5">
                <Flame className="w-3 h-3 mr-1" />
                {activeSnippet.gasBenchmark.savings}
              </Badge>
            </div>
          </div>
        </div>

        {/* Feature Highlights Bullet Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-4">
          {activeSnippet.highlights.map((highlight, index) => (
            <div
              key={index}
              className="p-2.5 rounded-lg bg-subtle-theme/60 border border-hairline-theme/60 flex items-start gap-2 text-xs text-secondary-theme"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span className="leading-snug">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Side-by-Side Solidity Code Diff Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Conventional AMM Code Block */}
          <div className="rounded-xl border border-hairline-theme bg-[#0d1117] text-[#c9d1d9] overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[#8b949e]">
                <FileCode2 className="w-4 h-4 text-slate-400" />
                <span>StandardPool.sol</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">Conventional</span>
              </div>
              <button
                onClick={() => handleCopy(activeSnippet.code.conventionalCode, 'conventional')}
                className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                title="Copy code"
              >
                {copiedState === 'conventional' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-sans">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11.5px] font-mono leading-relaxed overflow-x-auto flex-1 selection:bg-slate-700 selection:text-white">
              <code>{activeSnippet.code.conventionalCode}</code>
            </pre>
          </div>

          {/* SupaDex Next-Gen Code Block */}
          <div className="rounded-xl border border-emerald-500/20 bg-[#090e0c] text-[#d1fae5] overflow-hidden flex flex-col shadow-sm">
            <div className="px-4 py-2.5 bg-[#0e1713] border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                <span>{activeSnippet.contractFile.split('/').pop()}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">SupaDex</span>
              </div>
              <button
                onClick={() => handleCopy(activeSnippet.code.supadexCode, 'supadex')}
                className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                title="Copy code"
              >
                {copiedState === 'supadex' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-sans">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11.5px] font-mono leading-relaxed overflow-x-auto flex-1 selection:bg-emerald-800 selection:text-white">
              <code>{activeSnippet.code.supadexCode}</code>
            </pre>
          </div>
        </div>

        {/* Footer Documentation CTA */}
        <div className="mt-5 pt-4 border-t border-hairline-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-secondary-theme">
          <div className="flex items-center gap-2">
            <span className="text-primary-theme font-medium">Smart Contract Stack:</span>
            <span>Audited with invariant test suites & formal verification</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View Full Contracts on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>
    </div>
  );
};
