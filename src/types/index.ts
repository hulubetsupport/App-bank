export type ScreenType = 'login' | 'home' | 'transactions' | 'transfer' | 'receipt' | 'government';

export type TxType = 'debited' | 'credited';

export interface Transaction {
  id: string;
  name: string;
  date: string;
  timestamp: number;
  amount: number;
  type: TxType;
  category: string;
  referenceId: string;
  accountNumber?: string;
  remark?: string;
}

export interface Recipient {
  name: string;
  accountNumber: string;
  masked: string;
  initials: string;
  category?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  timeMs: number;
  action: string;
  category: 'AUTH' | 'TRANSACTION' | 'SECURITY' | 'SETTINGS' | 'SYSTEM';
  details: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  timeMs: number;
  read: boolean;
  type: 'TRANSACTION' | 'SECURITY' | 'SYSTEM' | 'INFO';
  amount?: number;
}

export interface UserAccount {
  name: string;
  accountName: string;
  accountNumber: string;
  maskedAccountNumber: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}
