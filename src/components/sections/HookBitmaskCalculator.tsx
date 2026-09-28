import React, { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HookFlag {
  id: string;
  name: string;
  bit: number;
  hex: string;
  description: string;
}

const HOOK_FLAGS: HookFlag[] = [
  {
    id: 'BEFORE_INITIALIZE',
    name: 'BEFORE_INITIALIZE',
    bit: 13,
    hex: '0x2000',
    description: 'Hook called before pool initialization.',
  },
  {
    id: 'AFTER_INITIALIZE',
    name: 'AFTER_INITIALIZE',
    bit: 12,
    hex: '0x1000',
    description: 'Hook called immediately after pool initialization.',
  },
  {
    id: 'BEFORE_ADD_LIQUIDITY',
    name: 'BEFORE_ADD_LIQUIDITY',
    bit: 11,
    hex: '0x0800',
    description: 'Enforces anti-JIT fee lock duration check on LP entry.',
  },
  {
    id: 'AFTER_ADD_LIQUIDITY',
    name: 'AFTER_ADD_LIQUIDITY',
    bit: 10,
    hex: '0x0400',
    description: 'Hook notified after liquidity is minted.',
  },
  {
    id: 'BEFORE_REMOVE_LIQUIDITY',
    name: 'BEFORE_REMOVE_LIQUIDITY',
    bit: 9,
    hex: '0x0200',
    description: 'Calculates vested LP exit fee penalty if removed prematurely.',
  },
  {
    id: 'AFTER_REMOVE_LIQUIDITY',
    name: 'AFTER_REMOVE_LIQUIDITY',
    bit: 8,
    hex: '0x0100',
    description: 'Hook notified after liquidity is burned.',
  },
  {
    id: 'BEFORE_SWAP',
    name: 'BEFORE_SWAP',
    bit: 7,
    hex: '0x0080',
    description: 'Calculates dynamic LVR spread fee and adjusts pool price delta.',
  },
  {
    id: 'AFTER_SWAP',
    name: 'AFTER_SWAP',
    bit: 6,
    hex: '0x0040',
    description: 'Initiates exponential volatility decay timer post-swap.',
  },
  {
    id: 'BEFORE_DONATE',
    name: 'BEFORE_DONATE',
    bit: 5,
    hex: '0x0020',
    description: 'Validates direct LP token fee donations.',
  },
  {
    id: 'AFTER_DONATE',
    name: 'AFTER_DONATE',
    bit: 4,
    hex: '0x0010',
    description: 'Hook notified after donate balance delta settling.',
  },
];

export const HookBitmaskCalculator: React.FC = () => {
  const [selectedFlags, setSelectedFlags] = useState<string[]>([
    'BEFORE_SWAP',
    'AFTER_SWAP',
    'BEFORE_ADD_LIQUIDITY',
  ]);
  const [copied, setCopied] = useState(false);

  const toggleFlag = (id: string) => {
    setSelectedFlags((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculate bitmask integer
  const bitmaskInt = HOOK_FLAGS.reduce((acc, flag) => {
    if (selectedFlags.includes(flag.id)) {
      return acc | (1 << flag.bit);
    }
    return acc;
  }, 0);

  const bitmaskHex = '0x' + bitmaskInt.toString(16).padStart(4, '0');
  const targetAddressPrefix = `${bitmaskHex.slice(2)}...0000`;

  const copyCode = () => {
    const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { BaseHook } from "@supadex/core/BaseHook.sol";
import { Hooks } from "@supadex/core/libraries/Hooks.sol";

contract CustomSupaDexHook is BaseHook {
    // Required Bitmask: ${bitmaskHex} (${selectedFlags.join(' | ')})
    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
${HOOK_FLAGS.map((f) => `            ${f.id.toLowerCase().replace(/_([a-z])/g, (_, l) => l.toUpperCase())}: ${selectedFlags.includes(f.id) ? 'true' : 'false'}`).join(',\n')}
        });
    }
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 border-hairline-theme bg-surface-theme space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline-theme">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-[#16a34a] dark:text-[#22c55e]" />
            <h3 className="font-semibold text-primary-theme text-sm tracking-tight">
              Interactive Hook Bitmask Permission Generator
            </h3>
          </div>
          <p className="text-xs text-secondary-theme">
            SupaDex uses bitwise address flags to execute zero-gas hook verification in Yul assembly without runtime pre-flights.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-[11px] self-start sm:self-auto text-secondary-theme">
          Bitmask: {bitmaskHex}
        </Badge>
      </div>

      {/* Flag Checkbox Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {HOOK_FLAGS.map((flag) => {
          const isSelected = selectedFlags.includes(flag.id);
          return (
            <button
              key={flag.id}
              onClick={() => toggleFlag(flag.id)}
              className={`p-3 rounded-lg border text-left transition-all apple-spring-press cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-subtle-theme border-[#16a34a] dark:border-[#22c55e]'
                  : 'bg-surface-theme border-hairline-theme hover:border-border-theme opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                    isSelected
                      ? 'bg-[#16a34a] dark:bg-[#22c55e] text-white border-transparent'
                      : 'border-hairline-theme bg-surface-theme'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className={`font-mono text-xs font-semibold ${
                    isSelected ? 'text-primary-theme' : 'text-secondary-theme'
                  }`}>
                    {flag.name}
                  </span>
                </div>
                <p className="text-[11px] text-tertiary-theme pl-5 leading-tight">
                  {flag.description}
                </p>
              </div>
              <span className="text-[10px] font-mono text-tertiary-theme shrink-0 px-1.5 py-0.5 rounded bg-surface-theme border border-hairline-theme">
                1 &lt;&lt; {flag.bit} ({flag.hex})
              </span>
            </button>
          );
        })}
      </div>

      {/* Resulting Address & Yul Invariant Card */}
      <div className="p-4 rounded-xl bg-subtle-theme border border-hairline-theme space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-tertiary-theme uppercase tracking-wider font-mono">
              Required Hook CREATE2 Address Prefix
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary-theme">
                {targetAddressPrefix}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                Mined via CREATE2 Salt
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyCode}
            className="gap-1.5 text-xs font-mono self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Template</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Solidity Scaffold</span>
              </>
            )}
          </Button>
        </div>

        {/* Yul Assembly Verification Snippet */}
        <div className="p-3 rounded-lg bg-[#08090b] text-[#e2e8f0] font-mono text-xs border border-white/10 overflow-x-auto space-y-1 shadow-inner">
          <div className="text-tertiary-theme text-[10px]">// SupaDex Inline Yul Bitmask Permission Check (~8 gas)</div>
          <code>
            <span className="text-purple-400">assembly</span> {'{'}
            <br />
            &nbsp;&nbsp;<span className="text-blue-400">let</span> hookFlags := <span className="text-amber-400">shr</span>(144, <span className="text-emerald-400">hookAddress</span>)
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">if</span> <span className="text-amber-400">iszero</span>(<span className="text-amber-400">and</span>(hookFlags, {bitmaskHex})) {'{'}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">revert</span>(0, 0)
            <br />
            &nbsp;&nbsp;{'}'}
            <br />
            {'}'}
          </code>
        </div>
      </div>
    </Card>
  );
};
