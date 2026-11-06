import React, { useEffect } from 'react';
import { ShieldCheck, Check, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio.ts';

interface ReceiptScreenProps {
  transaction: Transaction;
  senderName: string;
  onDone: () => void;
  onShareNotice: (msg: string) => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  transaction,
  senderName,
  onDone,
  onShareNotice,
}) => {
  useEffect(() => {
    playChime('success');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.25 },
        colors: ['#7C21A4', '#dfba6c', '#2e7d32'],
      });
    } catch {
      // ignore
    }
  }, []);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `CBE-TX|ID:${transaction.referenceId}|AMT:${transaction.amount}|FOR:${transaction.name}|DATE:${transaction.date}`
  )}`;

  const handleDownload = () => {
    playChime('tap');
    onShareNotice(`Receipt ${transaction.referenceId} saved to downloads`);
  };

  const handleShare = () => {
    playChime('tap');
    if (navigator.share) {
      navigator
        .share({
          title: `CBE Transaction ${transaction.referenceId}`,
          text: `CBE Mobile Banking Receipt: ETB ${formatETB(
            transaction.amount
          )} debited for ${transaction.name} on ${transaction.date}. Ref: ${
            transaction.referenceId
          }`,
        })
        .catch(() => {});
    } else {
      onShareNotice('Transaction details copied to clipboard');
    }
  };

  const shortAcc = transaction.accountNumber
    ? `ETB-${transaction.accountNumber.slice(-4)}`
    : 'ETB-7314';

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar">
      {/* Purple Top Banner */}
      <div className="relative bg-[#7C21A4] h-38 px-6 pt-5 text-white shrink-0">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white/90" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Thank you</h2>
            <p className="text-xs text-purple-200 font-medium">Success</p>
          </div>
        </div>

        {/* Big White Checkmark Circle overlapping */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-1.5 z-10">
          <div className="w-full h-full rounded-full bg-[#7C21A4] flex items-center justify-center text-white">
            <Check className="w-10 h-10 stroke-[3.5]" />
          </div>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="p-4.5 pt-13 flex-1 flex flex-col items-center">
        <h3 className="text-[14px] font-bold text-neutral-800 text-center mb-4">
          Transaction Completed Successfully!
        </h3>

        {/* Gray Summary Card */}
        <div className="w-full bg-[#f6f6f6] border border-neutral-200/90 rounded-2xl p-4 text-neutral-800 shadow-2xs">
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
            <span>{shortAcc}</span> on{' '}
            <strong className="text-neutral-900 font-bold">{transaction.date}</strong> with
            transaction ID:{' '}
            <strong className="text-neutral-900 font-bold font-mono">
              {transaction.referenceId}
            </strong>
            .
          </p>

          <div className="mt-3 pt-2 text-[11.5px] leading-relaxed text-neutral-600 border-t border-neutral-200/60">
            <div>
              Reason: <span className="font-medium text-neutral-800">{transaction.remark || 'MB transfer'}</span>
            </div>
            <div className="mt-1">
              Total Amount Debited: ETB{formatETB(transaction.amount)} with Service Charge
              of ETB0.00, VAT (15%) of 0.0 and Disaster Recovery (5%) of ETB0.00.
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex justify-center my-4">
            <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-xs">
              <img
                src={qrUrl}
                alt="Receipt QR Code"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          {/* CBE Footer */}
          <div className="pt-3 border-t border-dashed border-neutral-300 flex items-center gap-2.5">
            <img
              src="https://i.postimg.cc/Hk1pN2VS/20260805-174301.png"
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

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2.5 mt-4">
          <button
            onClick={handleShare}
            className="flex-1 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>

        <button
          onClick={onDone}
          className="w-full h-11 rounded-full bg-[#7C21A4] hover:bg-[#68198a] active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md shadow-purple-900/20 transition mt-3 mb-2"
        >
          Done
        </button>
      </div>
    </div>
  );
};
