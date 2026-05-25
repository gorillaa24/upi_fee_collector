import React from 'react';
import { Moon, Sun, Banknote } from 'lucide-react';

interface HeaderProps {
  dark: boolean;
  onToggleDark: () => void;
}

export function Header({ dark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/30">
            <Banknote className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              UPI Fee Collection
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">
              CA Firm Payment Gateway
            </p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>
    </header>
  );
}
