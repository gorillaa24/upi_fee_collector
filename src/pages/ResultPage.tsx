import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  MessageCircle,
  Link2,
  Plus,
  CheckCircle,
  IndianRupee,
  User,
  FileText,
  CreditCard,
} from 'lucide-react';
import { PaymentData } from '../types';
import { buildUPIString, formatINR, copyToClipboard } from '../utils';
import { ActionButton } from '../components/ActionButton';
import { useQRHistory } from '../hooks/useQRHistory';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ToastContainer';

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addEntry } = useQRHistory();
  const { toasts, addToast, removeToast } = useToast();
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const savedRef = useRef(false);

  // Guard: if no state, go back to form
  const data = location.state as PaymentData | null;

  useEffect(() => {
    if (!data) {
      navigate('/');
      return;
    }
    // Save to history once per visit
    if (!savedRef.current) {
      savedRef.current = true;
      addEntry(data);
    }
  }, [data, navigate, addEntry]);

  if (!data) return null;

  const upiString = buildUPIString(data);

  // ── Download QR as PNG ──────────────────────────────────────────────────
  const handleDownload = () => {
    // Find the canvas rendered by QRCodeCanvas
    const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      addToast('QR canvas not found. Try again.', 'error');
      return;
    }

    // Create a padded export canvas
    const padding = 24;
    const size = canvas.width + padding * 2;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(canvas, padding, padding);

    const link = document.createElement('a');
    link.download = `${data.clientName.replace(/\s+/g, '_')}_UPI_QR.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    addToast('QR Code downloaded successfully!', 'success');
  };

  // ── WhatsApp share ──────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    const msg = `Dear ${data.clientName},

Please make payment using the UPI link below.

💰 Amount: ${formatINR(data.amount)}
📝 Remarks: ${data.remarks}

🔗 UPI Payment Link:
${upiString}

Thank you.`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addToast('Opening WhatsApp…', 'info');
  };

  // ── Copy UPI link ───────────────────────────────────────────────────────
  const handleCopy = async () => {
    const success = await copyToClipboard(upiString);
    if (success) {
      addToast('UPI payment link copied!', 'success');
    } else {
      addToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // ── Generate another ───────────────────────────────────────────────────
  const handleAnother = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Success badge */}
        <div className="flex items-center gap-2 mb-6 animate-fade-up">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            QR Code Generated Successfully
          </span>
        </div>

        {/* QR Card */}
        <div
          className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60
            shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 p-6 animate-scale-in"
        >
          {/* Client details grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <DetailChip icon={<User className="w-3.5 h-3.5" />} label="Client" value={data.clientName} />
            <DetailChip
              icon={<IndianRupee className="w-3.5 h-3.5" />}
              label="Amount"
              value={formatINR(data.amount)}
              highlight
            />
            <DetailChip icon={<CreditCard className="w-3.5 h-3.5" />} label="UPI ID" value={data.upiId} mono />
            <DetailChip icon={<FileText className="w-3.5 h-3.5" />} label="Remarks" value={data.remarks} />
          </div>

          {/* QR Code */}
          <div
            id="qr-canvas"
            className="flex flex-col items-center justify-center bg-white rounded-2xl p-5
              border-2 border-dashed border-slate-100 dark:border-slate-700 mx-auto"
          >
            <QRCodeCanvas
              value={upiString}
              size={220}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: '/favicon.svg',
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
            <p className="mt-3 text-xs text-slate-400 font-mono">Scan with any UPI app</p>
          </div>

          {/* UPI string preview */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-semibold uppercase tracking-wider mb-1">
              UPI Payment String
            </p>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed">
              {upiString}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <ActionButton
            onClick={handleDownload}
            icon={<Download className="w-4 h-4" />}
            label="Download QR"
            variant="primary"
          />
          <ActionButton
            onClick={handleWhatsApp}
            icon={<MessageCircle className="w-4 h-4" />}
            label="Send via WhatsApp"
            variant="success"
          />
          <ActionButton
            onClick={handleCopy}
            icon={<Link2 className="w-4 h-4" />}
            label="Copy UPI Link"
            variant="outline"
          />
          <ActionButton
            onClick={handleAnother}
            icon={<Plus className="w-4 h-4" />}
            label="Generate Another"
            variant="secondary"
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

// ── Sub-component: Detail chip ─────────────────────────────────────────────

interface DetailChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}

function DetailChip({ icon, label, value, highlight, mono }: DetailChipProps) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-600 mb-0.5">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-sm truncate font-semibold leading-snug
          ${highlight ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'}
          ${mono ? 'font-mono text-xs' : ''}
        `}
      >
        {value}
      </p>
    </div>
  );
}
