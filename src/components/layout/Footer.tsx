import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-hairline-theme bg-surface-theme text-secondary-theme text-xs py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {/* Protocol Details */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/images/supadao-logo.png"
              alt="SupaDex Logo"
              className="w-6 h-6 rounded-md object-contain"
            />
            <span className="font-semibold text-primary-theme text-sm tracking-tight">SupaDex</span>
          </div>
          <p className="text-tertiary-theme text-xs leading-relaxed max-w-xs">
            Next-generation decentralized exchange architecture pairing multi-curve invariant engines with dynamic volatility protection.
          </p>
        </div>

        {/* Architecture Links */}
        <div className="space-y-2.5">
          <h4 className="text-primary-theme font-medium text-xs tracking-wider uppercase">Technology</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/curves" className="hover:text-primary-theme transition-colors">
                Concentrated CLAMM
              </Link>
            </li>
            <li>
              <Link to="/curves" className="hover:text-primary-theme transition-colors">
                Discretized Bin AMM
              </Link>
            </li>
            <li>
              <Link to="/curves" className="hover:text-primary-theme transition-colors">
                StableSwap Invariant
              </Link>
            </li>
            <li>
              <Link to="/simulator" className="hover:text-primary-theme transition-colors">
                Dynamic LVR Sandbox
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer Resources */}
        <div className="space-y-2.5">
          <h4 className="text-primary-theme font-medium text-xs tracking-wider uppercase">Developers</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/developers" className="hover:text-primary-theme transition-colors">
                Hook SDK & Bitmasks
              </Link>
            </li>
            <li>
              <Link to="/developers" className="hover:text-primary-theme transition-colors">
                Lifecycle Sequence
              </Link>
            </li>
            <li>
              <Link to="/comparison" className="hover:text-primary-theme transition-colors">
                Architecture Specs
              </Link>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-theme transition-colors"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        {/* Protocol */}
        <div className="space-y-2.5">
          <h4 className="text-primary-theme font-medium text-xs tracking-wider uppercase">Protocol</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://app-supadex.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-theme transition-colors"
              >
                Trading WebApp
              </a>
            </li>
            <li>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-theme transition-colors"
              >
                Governance Portal
              </a>
            </li>
            <li>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-theme transition-colors">
                X / Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-hairline-theme flex flex-col sm:flex-row items-center justify-between text-[11px] text-tertiary-theme">
        <p>© 2026 SupaDex Protocol. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Engineered for EVM & Transient Storage Execution</p>
      </div>
    </footer>
  );
};
