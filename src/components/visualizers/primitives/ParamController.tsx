import React from 'react';

interface ParamControllerProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  description?: string;
  onChange: (val: number) => void;
  className?: string;
}

export const ParamController: React.FC<ParamControllerProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  description,
  onChange,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div
      className={`flex flex-col gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-white/[0.02] shadow-xs transition-colors ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 select-none">
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-300 dark:border-white/10 shadow-xs">
          {value}
          {unit && <span className="text-slate-600 dark:text-zinc-400 ml-0.5 text-[10px]">{unit}</span>}
        </span>
      </div>

      {/* Apple-style Custom Track and Thumb */}
      <div className="relative flex items-center h-6 my-0.5">
        {/* Track Background - Soft grey in light, deep zinc in dark */}
        <div className="absolute w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          {/* Active Filled Track - High contrast emerald green */}
          <div
            className="h-full bg-[#16a34a] dark:bg-[#22c55e] rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native Slider Input for smooth drag interactions */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Apple Handle / Thumb */}
        <div
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.25)] border-2 border-[#16a34a] dark:border-[#22c55e] pointer-events-none transform -translate-x-1/2 transition-transform active:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {description && (
        <span className="text-[11px] text-slate-600 dark:text-zinc-400 leading-tight select-none font-medium">
          {description}
        </span>
      )}
    </div>
  );
};
