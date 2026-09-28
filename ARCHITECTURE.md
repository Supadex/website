# SupaDex Public Landing & Visualizer Architecture (`/landing`)

## 1. Executive Summary
The **SupaDex Landing Portal** is the institutional public entryway, interactive protocol visualizer, and developer documentation hub for the SupaDex AMM. It demonstrates the technical superiority over Uniswap V4 through interactive simulations of dynamic LVR capture, anti-JIT liquidity vesting, and the multi-curve engine.

---

## 2. Directory Structure & Module Breakdown

```
landing/src/
├── assets/                  # High-definition vector graphics, technical diagrams
├── components/
│   ├── ui/                  # Shared Apple-minimalist UI Primitives (Button, Modal, Card, etc.)
│   ├── visualizers/         # Interactive Protocol Demonstrators
│   │   ├── LVRSimulator/    # Live CEX-DEX arbitrage vs. Dynamic Spread simulation
│   │   ├── MultiCurveCanvas/# Interactive SVG/Canvas for CLAMM vs BinAMM vs StableSwap
│   │   ├── ComparisonTable/ # Uniswap V4 vs SupaDex architectural matrix
│   │   └── MetricsBanner/   # Real-time TVL, Volume, LVR Retained statistics
│   ├── sections/            # Page Sections
│   │   ├── Hero/            # Apple-style typography headline & interactive AMM ribbon
│   │   ├── ProblemSolution/ # In-depth flaw breakdown of legacy AMMs
│   │   ├── EngineMatrix/    # Multi-curve explanation & bin zero-slippage demo
│   │   ├── AntiMEV/         # LVR Shield & Anti-JIT fee vesting explanation
│   │   ├── Developers/      # Hybrid Plugin SDK code preview & hook architecture
│   │   └── Community/       # Ecosystem links, audit reports & documentation
│   └── layout/              # Landing Navbar, Footer, Sticky CTA
├── config/                  # App configuration, public RPCs, doc links
├── constants/               # Protocol benchmarks, comparative data sets
├── context/                 # ThemeContext, AnimationContext
├── hooks/
│   ├── useTheme.ts          # Dark / Light theme controller
│   ├── useProtocolStats.ts  # Live on-chain metrics aggregator
│   └── useScrollSpy.ts      # Active navigation section tracker
├── pages/                   # Lazy-Loaded Landing Routes
│   ├── Home/                # Main Landing Page
│   ├── Compare/             # Deep technical comparison (Uniswap V4 vs SupaDex)
│   ├── Simulator/           # Full-screen LVR & Arbitrage interactive sandbox
│   └── Docs/                # Hook developer quickstart & contract references
├── providers/               # Theme & Query Providers
├── routes/                  # Route definitions
├── types/                   # TypeScript interfaces
└── utils/                   # Math calculations, canvas physics, formatters
```
