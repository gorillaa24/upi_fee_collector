// Core payment data types
export interface PaymentData {
  clientName: string;
  amount: string;
  remarks: string;
  upiId: string;
}

export interface QRHistoryEntry extends PaymentData {
  id: string;
  createdAt: string;
  upiString: string;
}

export interface FormErrors {
  clientName?: string;
  amount?: string;
  remarks?: string;
  upiId?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
