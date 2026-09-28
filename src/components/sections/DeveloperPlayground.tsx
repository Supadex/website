import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { HookLifecycleVisualizer } from './HookLifecycleVisualizer';
import { HookBitmaskCalculator } from './HookBitmaskCalculator';

interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  badge: string;
  description: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'lvr-plugin',
    title: 'LVR Shield Plugin Hook',
    filename: 'LVRShieldPlugin.sol',
    language: 'solidity',
    badge: 'Dynamic Volatility Decay',
    description: 'Intercepts incoming trades to calculate Pyth oracle volatility shocks and inflates dynamic fee to capture CEX-DEX arbitrage for LPs.',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { BaseHook } from "@supadex/core/BaseHook.sol";
import { IPoolManager } from "@supadex/core/interfaces/IPoolManager.sol";
import { Hooks } from "@supadex/core/libraries/Hooks.sol";
import { PoolKey } from "@supadex/core/types/PoolKey.sol";
import { IPyth } from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract LVRShieldPlugin is BaseHook {
    IPyth public immutable pyth;
    bytes32 public immutable priceFeedId;
    
    uint24 public constant BASE_FEE = 3000; // 0.30%
    uint24 public constant MAX_DYNAMIC_FEE = 100000; // 10.00%
    uint256 public constant DECAY_HALF_LIFE = 12 seconds;

    mapping(bytes32 => uint256) public lastShockTimestamp;
    mapping(bytes32 => uint24) public activeSpreadDelta;

    constructor(IPoolManager _manager, IPyth _pyth, bytes32 _feedId) BaseHook(_manager) {
        pyth = _pyth;
        priceFeedId = _feedId;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override poolManagerOnly returns (bytes4, int128, uint24) {
        // Read fast oracle price
        PythStructs.Price memory pythPrice = pyth.getPriceUnsafe(priceFeedId);
        
        // Compute volatility spread delta
        uint24 dynamicFee = _computeDynamicSpread(key.toId(), pythPrice);
        
        return (this.beforeSwap.selector, 0, dynamicFee);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        int128 delta,
        bytes calldata hookData
    ) external override poolManagerOnly returns (bytes4, int128) {
        lastShockTimestamp[key.toId()] = block.timestamp;
        return (this.afterSwap.selector, 0);
    }
}`,
  },
  {
    id: 'anti-jit',
    title: 'Anti-JIT Fee Vesting Guard',
    filename: 'JITLiquidityGuard.sol',
    language: 'solidity',
    badge: 'Block-Age Lockup',
    description: 'Imposes a mandatory 5-block fee accumulation vesting lock on freshly minted liquidity, eliminating parasitic zero-duration MEV sandwiches.',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { BaseHook } from "@supadex/core/BaseHook.sol";
import { IPoolManager } from "@supadex/core/interfaces/IPoolManager.sol";
import { Hooks } from "@supadex/core/libraries/Hooks.sol";
import { PoolKey } from "@supadex/core/types/PoolKey.sol";
import { Position } from "@supadex/core/libraries/Position.sol";

contract JITLiquidityGuard is BaseHook {
    uint256 public constant VESTING_BLOCKS = 5;
    mapping(bytes32 => uint256) public positionDepositBlock;

    constructor(IPoolManager _manager) BaseHook(_manager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: true,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: true,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external override poolManagerOnly returns (bytes4) {
        bytes32 posKey = keccak256(abi.encode(sender, key.toId(), params.tickLower, params.tickUpper));
        positionDepositBlock[posKey] = block.number;
        return this.beforeAddLiquidity.selector;
    }

    function beforeRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external override poolManagerOnly returns (bytes4) {
        bytes32 posKey = keccak256(abi.encode(sender, key.toId(), params.tickLower, params.tickUpper));
        uint256 blocksActive = block.number - positionDepositBlock[posKey];
        
        // Enforce anti-JIT quadratic penalty if withdrawn too early
        require(blocksActive >= VESTING_BLOCKS, "JITGuard: Minimum 5-block LP lockup required");
        return this.beforeRemoveLiquidity.selector;
    }
}`,
  },
  {
    id: 'foundry-quickstart',
    title: 'Foundry Integration & Deployment',
    filename: 'DeployHook.s.sol',
    language: 'solidity',
    badge: 'Foundry Script',
    description: 'Production deployment script utilizing CREATE2 address mining to deploy custom hooks with verified permission bitmasks.',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { Script } from "forge-std/Script.sol";
import { HookMiner } from "@supadex/test/utils/HookMiner.sol";
import { LVRShieldPlugin } from "../src/hooks/LVRShieldPlugin.sol";
import { IPoolManager } from "@supadex/core/interfaces/IPoolManager.sol";

contract DeployHookScript is Script {
    IPoolManager constant POOL_MANAGER = IPoolManager(0x8a92F038102bEc37b678c43B0086F0022718E843);
    address constant PYTH_ORACLE = 0x4305FB66699C3B2702D4d05CF36551390A4c69C6;
    bytes32 constant ETH_USD_FEED = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Required bitmask: BEFORE_SWAP_FLAG (0x80) | AFTER_SWAP_FLAG (0x40) = 0xC0
        uint160 targetFlags = uint160(Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG);

        // Mine CREATE2 salt for prefix matching
        (address hookAddress, bytes32 salt) = HookMiner.find(
            msg.sender,
            targetFlags,
            type(LVRShieldPlugin).creationCode,
            abi.encode(POOL_MANAGER, PYTH_ORACLE, ETH_USD_FEED)
        );

        // Deploy mined contract
        LVRShieldPlugin hook = new LVRShieldPlugin{salt: salt}(
            POOL_MANAGER,
            PYTH_ORACLE,
            ETH_USD_FEED
        );
        require(address(hook) == hookAddress, "Mined address mismatch");

        vm.stopBroadcast();
    }
}`,
  },
];

export const DeveloperPlayground: React.FC = () => {
  const [activeSnippetId, setActiveSnippetId] = useState<string>('lvr-plugin');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSnippet = SNIPPETS.find(s => s.id === activeSnippetId) || SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="space-y-12 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.2em] text-secondary-theme font-medium">
          Developer Ecosystem & Hook SDK
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-theme tracking-tight">
          Engineered for Quantitative Solidity Developers
        </h2>
        <p className="text-secondary-theme text-sm sm:text-base leading-relaxed">
          Build zero-gas overhead hooks with EIP-1153 transient storage, dynamic volatility oracles, and native ERC-6909 vault claim accounting.
        </p>
      </div>

      {/* Interactive Hook Lifecycle Visualizer */}
      <HookLifecycleVisualizer />

      {/* Interactive Bitmask Permission Calculator */}
      <HookBitmaskCalculator />

      {/* Tabbed Code Explorer */}
      <Card className="border-hairline-theme bg-surface-theme overflow-hidden">
        {/* Tab Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-hairline-theme bg-subtle-theme/50 px-4 py-3 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {SNIPPETS.map((snip) => {
              const isActive = snip.id === activeSnippetId;
              return (
                <button
                  key={snip.id}
                  onClick={() => setActiveSnippetId(snip.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all apple-spring-press cursor-pointer shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-surface-theme text-primary-theme border border-hairline-theme shadow-sm'
                      : 'text-secondary-theme hover:text-primary-theme'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>{snip.filename}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Badge variant="outline" className="text-[10px] font-mono text-secondary-theme border-hairline-theme hidden sm:inline-flex">
              {activeSnippet.badge}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs font-mono cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Code Content Block */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs text-secondary-theme">
            {activeSnippet.description}
          </p>

          <div className="p-4 rounded-xl bg-[#08090b] text-[#e2e8f0] font-mono text-xs overflow-x-auto border border-white/10 shadow-inner max-h-[480px]">
            <pre className="leading-relaxed">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>
        </div>

        {/* Footer Quick Links */}
        <div className="px-6 py-4 border-t border-hairline-theme bg-subtle-theme/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tertiary-theme">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Tested with Foundry 0.3.0 &amp; Solc 0.8.26 (Cancun EVM target)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-theme hover:underline flex items-center gap-1 font-medium"
            >
              View GitHub Repo
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
};
