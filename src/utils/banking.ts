import { Recipient, ActivityLog } from '../types/index.ts';

/**
 * Real password specified by user is "0607" (supports 4 or 6 digits, configurable in Settings).
 */
export const DEFAULT_AUTH_PIN = '0607';

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

export function calculateCharges(amount: number) {
  const serviceCharge = 0.0;
  const vat = 0.0;
  const disasterRecovery = 0.0;
  const totalDebited = amount + serviceCharge + vat + disasterRecovery;

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

export const OFFICIAL_CBE_LOGO = '/assets/aistudio/unnamed_51f31b49.png';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    name: 'Sara Endris Ali',
    accountNumber: '1000293813474',
    masked: '1*********3474',
    initials: 'SE',
  },
  {
    name: 'Aminat Hassen Mohammed',
    accountNumber: '1000782917997',
    masked: '1*********7997',
    initials: 'AH',
  },
  {
    name: 'Habib Yimam Ahmed',
    accountNumber: '1000192810164',
    masked: '1*********0164',
    initials: 'HY',
  },
  {
    name: 'Yisak Hailu Desalegn',
    accountNumber: '1000293810588',
    masked: '1*********0588',
    initials: 'YH',
  },
  {
    name: 'Henok Dessie Assefa',
    accountNumber: '1000392813114',
    masked: '1*********3114',
    initials: 'HD',
  },
  {
    name: 'Desalegn Sitotaw Embiyalew',
    accountNumber: '1000492815123',
    masked: '1*********5123',
    initials: 'DS',
  },
  {
    name: 'Bilal Seid Abdu',
    accountNumber: '1000382106157',
    masked: '1*********6157',
    initials: 'BA',
  },
  {
    name: 'Abdu Mohammed Yimer',
    accountNumber: '1000639261186',
    masked: '1*********1186',
    initials: 'AM',
  },
  {
    name: 'Tsegaye Abebe Berihun',
    accountNumber: '1000066327314',
    masked: '1*********7314',
    initials: 'TA',
  },
  {
    name: 'Sualih Hussen Mohammed',
    accountNumber: '1000134189677',
    masked: '1*********9677',
    initials: 'SM',
  },
  {
    name: 'Deguale Shmels Amare',
    accountNumber: '1000723915434',
    masked: '1*********5434',
    initials: 'DS',
  },
  {
    name: 'Nebiyu Mohammed Ahmed',
    accountNumber: '1000415518599',
    masked: '1*********8599',
    initials: 'NM',
  },
];
