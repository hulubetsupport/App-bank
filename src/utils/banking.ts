import { Recipient, ActivityLog, Transaction, TxType, DeveloperSettings } from '../types/index.ts';

/**
 * Real password specified by user is "0607" (supports 4 or 6 digits, configurable in Settings).
 */
export const DEFAULT_AUTH_PIN = '0607';

export const DEFAULT_DEVELOPER_SETTINGS: DeveloperSettings = {
  defaultBalanceMasked: true,
  transferDelayMs: 1800,
  applyStandardFees: false,
  biometricsEnabled: true,
  cardLastUpdated: '06 Nov 2026 • 10:52 PM',
  autoLiveTimestamp: false,
  showCardWorldMap: true,
};

export function validatePassword(enteredPin: string, correctPin = DEFAULT_AUTH_PIN): boolean {
  if (!enteredPin) return false;
  return enteredPin.trim() === correctPin.trim();
}

export function formatETB(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCardTimestamp(date: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${day} ${month} ${year} • ${timeStr}`;
}

export function formatTransactionDate(date: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${day}-${month}-${year} ${timeStr}`;
}

export function formatReceiptDate(dateStr: string): string {
  const clean = (dateStr || '').trim();
  const match = clean.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})\s+(.+)$/);
  if (!match) return clean;
  const day = match[1].padStart(2, '0');
  const month = match[2];
  const fullYear = match[3].length === 2 ? `20${match[3]}` : match[3];
  const timePart = match[4];
  return `${month} ${day}, ${fullYear} ${timePart}`;
}

export function maskAccountNumber(acc: string): string {
  if (!acc || acc.length < 5) return acc;
  const first = acc.charAt(0);
  const lastFour = acc.slice(-4);
  return `${first}*********${lastFour}`;
}

export function searchRecipients(query: string, recipients: Recipient[]): Recipient[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];
  return recipients.filter((r) => {
    return (
      r.name.toLowerCase().includes(clean) ||
      r.accountNumber.includes(clean) ||
      r.initials.toLowerCase().includes(clean)
    );
  });
}

export function calculateCharges(amount: number, applyStandardFees = false) {
  if (!applyStandardFees) {
    return {
      serviceCharge: 0.0,
      vat: 0.0,
      disasterRecovery: 0.0,
      totalDebited: amount,
    };
  }
  const serviceCharge = Number(Math.min(15, Math.max(2, amount * 0.002)).toFixed(2));
  const vat = Number((serviceCharge * 0.15).toFixed(2));
  const disasterRecovery = Number((serviceCharge * 0.05).toFixed(2));
  const totalDebited = Number((amount + serviceCharge + vat + disasterRecovery).toFixed(2));

  return {
    serviceCharge,
    vat,
    disasterRecovery,
    totalDebited,
  };
}

export function generateTransactionId(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FT26311${randomPart.slice(0, 5)}`;
}

export function generateReceiptId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let res = 'v2-';
  for (let i = 0; i < 20; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export function createCustomTransaction(input: {
  name: string;
  amount: number;
  type: TxType;
  category?: string;
  accountNumber?: string;
  remark?: string;
  date?: string;
  referenceId?: string;
  receiptId?: string;
  balanceAfter?: number;
  serviceCharge?: number;
  vat?: number;
  disasterRecovery?: number;
}): Transaction {
  const now = Date.now();
  return {
    id: `tx_${now}_${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(),
    date: input.date?.trim() || formatTransactionDate(),
    timestamp: now,
    amount: Number(input.amount.toFixed(2)),
    type: input.type,
    category: (input.category || 'ACCOUNT TO ACCOUNT').trim().toUpperCase(),
    referenceId: input.referenceId?.trim() || generateTransactionId(),
    receiptId: input.receiptId?.trim() || generateReceiptId(),
    accountNumber: input.accountNumber?.trim() || '1000614289312',
    remark: input.remark?.trim() || 'MB Transfer',
    balanceAfter: input.balanceAfter,
    serviceCharge: input.serviceCharge ?? 0,
    vat: input.vat ?? 0,
    disasterRecovery: input.disasterRecovery ?? 0,
  };
}

export function removeTransactionById(transactions: Transaction[], id: string): Transaction[] {
  return transactions.filter((tx) => tx.id !== id);
}

export function createActivityLog(
  action: string,
  category: ActivityLog['category'],
  details: string,
  status: ActivityLog['status'] = 'SUCCESS'
): ActivityLog {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: `${dateStr} • ${timeStr}`,
    timeMs: now.getTime(),
    action,
    category,
    details,
    ipAddress: '197.156.103.42',
    device: 'Redmi Note 11 (Android 14) • CBE App v5.2.1',
    status,
  };
}

export const OFFICIAL_CBE_LOGO = './cbe-logo.png';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    name: 'Dawit Bekele Tadesse',
    accountNumber: '1000614289312',
    masked: '1*********9312',
    initials: 'DB',
  },
  {
    name: 'Tigist Alemu Kebede',
    accountNumber: '1000482910534',
    masked: '1*********0534',
    initials: 'TA',
  },
  {
    name: 'Yohannes Girma Tesfaye',
    accountNumber: '1000531746208',
    masked: '1*********6208',
    initials: 'YG',
  },
  {
    name: 'Mekdes Hailu Worku',
    accountNumber: '1000793104826',
    masked: '1*********4826',
    initials: 'MH',
  },
  {
    name: 'Bereket Assefa Desta',
    accountNumber: '1000648219305',
    masked: '1*********9305',
    initials: 'BA',
  },
  {
    name: 'Selamawit Tekle Gebre',
    accountNumber: '1000825193641',
    masked: '1*********3641',
    initials: 'ST',
  },
  {
    name: 'Binyam Negash Fikru',
    accountNumber: '1000376402819',
    masked: '1*********2819',
    initials: 'BN',
  },
  {
    name: 'Hanna Getachew Solomon',
    accountNumber: '1000912837452',
    masked: '1*********7452',
    initials: 'HG',
  },
  {
    name: 'Elias Tesfaye Mulugeta',
    accountNumber: '1000458921736',
    masked: '1*********1736',
    initials: 'ET',
  },
  {
    name: 'Rahel Shiferaw Demissie',
    accountNumber: '1000729405813',
    masked: '1*********5813',
    initials: 'RS',
  },
  {
    name: 'Kaleb Ayele Wondimu',
    accountNumber: '1000591384270',
    masked: '1*********4270',
    initials: 'KA',
  },
  {
    name: 'Mahlet Teshome Abera',
    accountNumber: '1000664029518',
    masked: '1*********9518',
    initials: 'MT',
  },
];
