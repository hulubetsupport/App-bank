import React from 'react';
import {
  ShieldCheck,
  Check,
  Share2,
  Scan,
  Receipt as ReceiptIcon,
  Maximize2,
} from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatETB, OFFICIAL_CBE_LOGO } from '../utils/banking.ts';

interface ReceiptScreenProps {
  transaction: Transaction;
  senderName: string;
  onClose: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  transaction,
  senderName,
  onClose,
}) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `CBE-TX|ID:${transaction.referenceId}|AMT:${transaction.amount}|FOR:${transaction.name}|DATE:${transaction.date}`
  )}`;

  const shortAcc = transaction.accountNumber
    ? transaction.accountNumber.slice(-4)
    : '6157';

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar select-none">
      {/* Top Purple Banner matching IMG_20261106_230127_820_dbe6b7dd.jpg */}
      <div className="relative bg-[#7C21A4] h-36 px-6 pt-4 text-white shrink-0 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white/95" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Thank you</h2>
            <p className="text-xs text-purple-200 font-medium">Success</p>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/90">
          <Scan className="w-4.5 h-4.5" />
        </button>

        {/* Big White Checkmark Circle overlapping */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 z-10">
          <div className="w-full h-full rounded-full bg-[#7C21A4] flex items-center justify-center text-white">
            <Check className="w-10 h-10 stroke-[3.5]" />
          </div>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="p-4.5 pt-13 flex-1 flex flex-col items-center">
        <h3 className="text-[13.5px] font-medium text-neutral-800 text-center mb-3">
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
            <strong className="text-neutral-900 font-bold">{senderName}</strong> ETB-9427 for{' '}
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

          {/* QR Code Container */}
          <div className="flex justify-center my-4">
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 shadow-2xs">
              <img
                src={qrUrl}
                alt="Receipt QR Code"
                className="w-34 h-34 object-contain"
              />
            </div>
          </div>

          {/* CBE Footer with official emblem */}
          <div className="pt-3 border-t border-dashed border-neutral-300 flex items-center gap-2.5">
            <img
              src={OFFICIAL_CBE_LOGO}
              alt="CBE"
              className="w-9 h-9 object-contain"
            />
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

        {/* Bottom Actions matching screenshot: Receipt, Screenshot, Share */}
        <div className="w-full flex items-center justify-around text-neutral-700 mt-6 px-4">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition"
          >
            <ReceiptIcon className="w-4 h-4 text-neutral-800" />
            <span>Receipt</span>
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition"
          >
            <Maximize2 className="w-4 h-4 text-neutral-800" />
            <span>Screenshot</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: `CBE Receipt ${transaction.referenceId}`,
                    text: `CBE Transaction: ETB ${formatETB(
                      transaction.amount
                    )} to ${transaction.name}. Ref: ${transaction.referenceId}`,
                  })
                  .catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7C21A4] transition"
          >
            <Share2 className="w-4 h-4 text-neutral-800" />
            <span>Share</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full h-11 rounded-full bg-[#EAE6DB] hover:bg-[#ded7c8] text-neutral-700 font-bold text-xs shadow-2xs transition mt-4 mb-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};
