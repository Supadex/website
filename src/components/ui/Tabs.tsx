import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-xs sm:text-sm py-1.5 px-3.5 gap-2',
    lg: 'text-sm sm:text-base py-2 px-4 gap-2.5',
  };

  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center space-x-4 border-b border-hairline-theme', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center font-medium pb-2.5 transition-colors cursor-pointer',
                sizes[size],
                isActive ? 'text-primary-theme font-semibold' : 'text-secondary-theme hover:text-primary-theme'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span>{tab.badge}</span>}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-accent)] rounded-full animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-white/10 rounded-xl shadow-xs transition-colors',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center justify-center rounded-lg transition-all duration-150 select-none cursor-pointer text-xs sm:text-sm',
              sizes[size],
              isActive
                ? 'bg-white text-slate-900 shadow-sm border border-slate-300/80 dark:bg-zinc-800 dark:text-white dark:border-white/10 font-bold'
                : 'text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white font-medium'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};
