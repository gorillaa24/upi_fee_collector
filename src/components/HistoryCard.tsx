import React from 'react';
import { Clock, IndianRupee } from 'lucide-react';
import { QRHistoryEntry } from '../types';
import { formatINR, formatDate } from '../utils';
import { useNavigate } from 'react-router-dom';

interface HistoryCardProps {
  entry: QRHistoryEntry;
}

export function HistoryCard({ entry }: HistoryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to result with existing data
    navigate('/result', {
      state: {
        clientName: entry.clientName,
        amount: entry.amount,
        remarks: entry.remarks,
        upiId: entry.upiId,
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700/60
        bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70
        hover:border-brand-300 dark:hover:border-brand-600/50
        transition-all group shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {entry.clientName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 truncate mt-0.5">{entry.upiId}</p>
          {entry.remarks && (
            <p className="text-xs text-slate-400 dark:text-slate-600 truncate mt-0.5 italic">{entry.remarks}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="flex items-center gap-0.5 text-sm font-bold text-brand-600 dark:text-brand-400">
            <IndianRupee className="w-3.5 h-3.5" />
            {parseFloat(entry.amount).toLocaleString('en-IN')}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-600">
            <Clock className="w-3 h-3" />
            {formatDate(entry.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
