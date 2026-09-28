import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'Overview', to: '/' },
    { label: 'Curves', to: '/curves' },
    { label: 'LVR Simulator', to: '/simulator' },
    { label: 'Comparison', to: '/comparison' },
    { label: 'Developers', to: '/developers' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline-theme bg-surface-theme/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2.5 group select-none">
            <img
              src="/assets/images/supadao-logo.png"
              alt="SupaDex Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain group-hover:scale-105 transition-transform apple-ease shadow-sm"
            />
            <span className="font-semibold tracking-tight text-primary-theme text-base sm:text-lg leading-none">
              Supa<span className="text-emerald-500 dark:text-emerald-400">Dex</span>
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium text-secondary-theme">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'text-primary-theme font-semibold bg-subtle-theme'
                      : 'hover:text-primary-theme hover:bg-subtle-theme/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-secondary-theme hover:text-primary-theme hover:bg-subtle-theme border border-transparent hover:border-hairline-theme transition-all apple-spring-press cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Supadex"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-secondary-theme hover:text-primary-theme hover:bg-subtle-theme border border-transparent hover:border-hairline-theme transition-all hidden sm:flex"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* Launch App Primary CTA (Apple minimal pill) */}
          <a
            href="https://app-supadex.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary-theme text-accent-primary-text hover:opacity-90 transition-opacity apple-spring-press"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-hairline-theme px-2 py-1.5 overflow-x-auto text-xs font-medium text-secondary-theme">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                isActive ? 'text-primary-theme font-semibold bg-subtle-theme' : 'hover:text-primary-theme'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};
