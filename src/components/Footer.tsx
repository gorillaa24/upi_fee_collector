import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Secure UPI Payment Collection</span>
      </div>
    </footer>
  );
}
