import { PaymentData, QRHistoryEntry } from '../types';

/**
 * Generate UPI deep-link string from payment data.
 * Format: upi://pay?pa=<UPI_ID>&pn=<CLIENT_NAME>&am=<AMOUNT>&cu=INR&tn=<REMARKS>
 */
export function buildUPIString(data: PaymentData): string {
  const params = new URLSearchParams({
    pa: data.upiId.trim(),
    pn: data.clientName.trim(),
    am: data.amount.trim(),
    cu: 'INR',
    tn: data.remarks.trim(),
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Format a number string as INR currency display string.
 */
export function formatINR(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

// ── Local Storage: QR History ──────────────────────────────────────────────

const HISTORY_KEY = 'upi_qr_history';
const MAX_HISTORY = 10;

export function saveToHistory(entry: Omit<QRHistoryEntry, 'id' | 'createdAt'>): QRHistoryEntry {
  const full: QRHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = loadHistory();
  const updated = [full, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return full;
}

export function loadHistory(): QRHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QRHistoryEntry[];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ── Local Storage: Dark Mode ───────────────────────────────────────────────

const DARK_KEY = 'upi_dark_mode';

export function getDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_KEY);
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function setDarkMode(value: boolean): void {
  localStorage.setItem(DARK_KEY, String(value));
}

// ── Date formatting ────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

// ── Clipboard ─────────────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}
