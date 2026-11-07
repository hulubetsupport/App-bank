import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Check,
  Share2,
  Scan,
  Receipt as ReceiptIcon,
  Maximize2,
} from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.svg';
import QRCode from 'qrcode';

interface ReceiptScreenProps {
  transaction: Transaction;
  senderName: string;
  senderAccount?: string;
  onClose: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  transaction,
  senderName,
  senderAccount = '1000562339427',
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const qrPayload = `CBE-TX|ID:${transaction.referenceId}|AMT:${transaction.amount}|FOR:${transaction.name}|DATE:${transaction.date}|RCPT:${transaction.receiptId}`;

  // Generate QR code instantly offline with 0 network latency
  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      color: {
        dark: '#1e1e1e',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {
        // Fallback to static SVG if canvas is unavailable
        setQrDataUrl('');
      });
  }, [qrPayload]);

  const senderLast4 = senderAccount ? senderAccount.slice(-4) : '9427';
  const shortAcc = transaction.accountNumber
    ? transaction.accountNumber.slice(-4)
    : '6157';

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar select-none relative w-full">
      {/* Top Purple Banner */}
      <div className="relative bg-[#7C21A4] h-36 px-5 pt-[calc(env(safe-area-inset-top,0px)+12px)] text-white shrink-0 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white/95" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Thank you</h2>
            <p className="text-xs text-purple-200 font-medium">Success</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white/90 transition"
          aria-label="Close receipt"
        >
          <Scan className="w-4 h-4" />
        </button>

        {/* Big White Checkmark Circle overlapping */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 z-10">
          <div className="w-full h-full rounded-full bg-[#7C21A4] flex items-center justify-center text-white shadow-inner">
            <Check className="w-10 h-10 stroke-[3.5]" />
          </div>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="p-4.5 pt-13 flex-1 flex flex-col items-center">
        <h3 className="text-[14px] font-medium text-neutral-800 text-center mb-3">
          Transaction Completed Successfully!
        </h3>

        {/* Gray Summary Card */}
        <div className="w-full bg-[#f4f4f4] border border-neutral-200/80 rounded-2xl p-4 text-neutral-800 shadow-2xs">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
            Transaction Summary
          </div>

          <p className="text-[13px] leading-relaxed text-neutral-700">
            ETB{' '}
            <strong className="text-neutral-900 font-bold">
              {formatETB(transaction.amount)}
            </strong>{' '}
            has been debited from{' '}
            <strong className="text-neutral-900 font-bold">{senderName}</strong> ETB-{senderLast4} for{' '}
            <strong className="text-neutral-900 font-bold">{transaction.name}</strong>{' '}
            <span>ETB-{shortAcc}</span> on{' '}
            <strong className="text-neutral-900 font-bold">{transaction.date}</strong> with
            transaction ID:{' '}
            <strong className="text-neutral-900 font-bold font-mono">
              {transaction.referenceId}
            </strong>
            . Reason: <span className="font-semibold text-neutral-800">{transaction.remark || 'MB Transfer'}</span>
          </p>

          <div className="mt-3 pt-2 text-[11.5px] leading-relaxed text-neutral-600 border-t border-neutral-200/60">
            Total Amount Debited: ETB{formatETB(transaction.amount)} with Service Charge
            of ETB0.00, VAT (15%) of 0.0 and Disaster Recovery (5%) of ETB0.00.
          </div>

          {/* Instant Offline QR Code Container */}
          <div className="flex justify-center my-4">
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 shadow-2xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Receipt QR Code"
                  className="w-34 h-34 object-contain"
                />
              ) : (
                <div className="w-34 h-34 flex items-center justify-center bg-neutral-100 rounded text-neutral-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
          </div>

          {/* CBE Footer with official emblem */}
          <div className="pt-3 border-t border-dashed border-neutral-300 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/10 p-0.5">
              <img
                src={cbeLogo}
                alt="Commercial Bank of Ethiopia"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.src = './cbe-logo.svg';
                }}
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                Commercial Bank of Ethiopia
              </h4>
              <p className="text-[10px] text-neutral-500 font-medium">
                The bank you can always rely on!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching original IMG_20261106_230127_820.jpg */}
        <div className="w-full flex items-center justify-around text-neutral-700 mt-6 px-4">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition active:scale-95"
          >
            <ReceiptIcon className="w-4 h-4 text-neutral-800" />
            <span>Receipt</span>
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition active:scale-95"
          >
            <Maximize2 className="w-4 h-4 text-neutral-800" />
            <span>Screenshot</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'CBE Transaction Receipt',
                  text: `CBE Transaction ID: ${transaction.referenceId} - ETB ${transaction.amount} paid to ${transaction.name}`,
                }).catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-neutral-800" />
            <span>Share</span>
          </button>
        </div>

        {/* Dedicated Full-Width Close Pill Button matching original screenshot */}
        <div className="w-full px-2 mt-5 mb-6">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-full bg-[#dedede] hover:bg-[#d4d4d4] active:scale-[0.99] text-neutral-800 font-semibold text-[14px] transition shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
