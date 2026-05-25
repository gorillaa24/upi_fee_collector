import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, History, Trash2, Sparkles } from 'lucide-react';
import { PaymentData, FormErrors } from '../types';
import { InputField } from '../components/InputField';
import { HistoryCard } from '../components/HistoryCard';
import { useQRHistory } from '../hooks/useQRHistory';

export function FormPage() {
  const navigate = useNavigate();
  const { history, clear } = useQRHistory();

  const [form, setForm] = useState<PaymentData>({
    clientName: '',
    amount: '',
    remarks: '',
    upiId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof PaymentData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!form.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!form.remarks.trim()) newErrors.remarks = 'Remarks are required';
    if (!form.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!form.upiId.includes('@')) {
      newErrors.upiId = 'UPI ID must contain "@" (e.g. name@upi)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      navigate('/result', { state: form });
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
      {/* Hero */}
      <div className="mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30
          border border-brand-200 dark:border-brand-800/50 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Instant QR Generation</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white leading-tight">
          Generate secure client<br />
          <span className="text-brand-600 dark:text-brand-400">payment QR codes</span> instantly
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fill in the details below to create a UPI QR code for fee collection.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60
        shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 p-6 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex flex-col gap-5">
          <InputField
            id="clientName"
            label="Client Name"
            placeholder="e.g. Rahul Sharma"
            value={form.clientName}
            onChange={updateField('clientName')}
            error={errors.clientName}
            autoFocus
          />
          <InputField
            id="amount"
            label="Amount (INR)"
            type="number"
            placeholder="e.g. 5500"
            prefix="₹"
            value={form.amount}
            onChange={updateField('amount')}
            error={errors.amount}
            hint="Enter amount without commas"
          />
          <InputField
            id="remarks"
            label="Remarks / Payment Note"
            placeholder="e.g. Professional Fees — April 2025"
            value={form.remarks}
            onChange={updateField('remarks')}
            error={errors.remarks}
          />
          <InputField
            id="upiId"
            label="Your UPI ID"
            placeholder="e.g. 9355068000@upi"
            value={form.upiId}
            onChange={updateField('upiId')}
            error={errors.upiId}
            hint="This is where the client's payment will be received"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
            bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600
            text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-600/40
            transition-all active:scale-[0.98]"
        >
          Generate QR Code
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Recent QR Codes</h2>
              <span className="text-xs text-slate-400 dark:text-slate-600 font-mono">({history.length})</span>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-600
                hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {history.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-600">
            Click any entry to regenerate its QR code
          </p>
        </div>
      )}
    </main>
  );
}
