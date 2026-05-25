import { useState, useCallback } from 'react';
import { QRHistoryEntry, PaymentData } from '../types';
import { saveToHistory, loadHistory, clearHistory, buildUPIString } from '../utils';

export function useQRHistory() {
  const [history, setHistory] = useState<QRHistoryEntry[]>(loadHistory);

  const addEntry = useCallback((data: PaymentData) => {
    const upiString = buildUPIString(data);
    const entry = saveToHistory({ ...data, upiString });
    setHistory(loadHistory());
    return entry;
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, addEntry, clear };
}
