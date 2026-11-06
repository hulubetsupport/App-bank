import { Recipient, ActivityLog, NotificationItem } from '../types/index.ts';

/**
 * Real password specified by user is "0607".
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
  // Mobile Banking CBE transfer charges
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
  for (let i = 0; i < 10; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FT26${randomPart}`;
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
    ipAddress: '197.156.103.42', // Ethio Telecom / Addis Ababa gateway
    device: 'Redmi Note 11 (Android 14) • CBE App v5.2.1',
    status,
  };
}

export function createPushNotification(
  title: string,
  message: string,
  type: NotificationItem['type'] = 'TRANSACTION',
  amount?: number
): NotificationItem {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return {
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    title,
    message,
    timestamp: timeStr,
    timeMs: now.getTime(),
    read: false,
    type,
    amount,
  };
}

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    name: 'Tsegaye Abebe Berihun',
    accountNumber: '1000293817314',
    masked: '1*********7314',
    initials: 'TA',
  },
  {
    name: 'Sofiya Seid Yesuf',
    accountNumber: '1000392819143',
    masked: '1*********9143',
    initials: 'SS',
  },
  {
    name: 'Bilal Seid Abdu',
    accountNumber: '1000382106157',
    masked: '1*********6157',
    initials: 'BA',
  },
  {
    name: 'Abdu Mohammed',
    accountNumber: '1000592813321',
    masked: '1*********3321',
    initials: 'AM',
  },
  {
    name: 'Aminat Mohammed',
    accountNumber: '1000782910012',
    masked: '1*********0012',
    initials: 'AM',
  },
  {
    name: 'Momina Mekuriyaw Adem',
    accountNumber: '1000482914708',
    masked: '1*********4708',
    initials: 'MM',
  },
  {
    name: 'Sara Endris Ali',
    accountNumber: '1000293813474',
    masked: '1*********3474',
    initials: 'SE',
  },
  {
    name: 'Nuru Ebrahim Ali',
    accountNumber: '1000192811159',
    masked: '1*********1159',
    initials: 'NE',
  },
  {
    name: 'Mohammed Esmael Mussa',
    accountNumber: '1000294816605',
    masked: '1*********6605',
    initials: 'ME',
  },
  {
    name: 'Fuad Aragaw Hassen',
    accountNumber: '1000192815952',
    masked: '1*********5952',
    initials: 'FA',
  },
  {
    name: 'Vip Lounge Viplounge',
    accountNumber: '1000626523475',
    masked: '1*********3475',
    initials: 'VL',
  },
];
