import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Check,
  Share2,
  Receipt as ReceiptIcon,
  Maximize2,
  Scan,
} from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.svg';
import QRCode from 'qrcode';

interface ReceiptScreenProps {
  transaction: Transaction;
  senderName: string;
  senderAccount?: string;
  remainingBalance?: number;
  onClose: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  transaction,
  senderName,
  senderAccount = '1000562339427',
  remainingBalance,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const qrPayload = `CBE-TX|ID:${transaction.referenceId}|AMT:${transaction.amount}|FOR:${transaction.name}|DATE:${transaction.date}|RCPT:${transaction.receiptId}`;

  // Instant offline QR code generation
  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#1e1e1e',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [qrPayload]);

  const senderLast4 = senderAccount ? senderAccount.slice(-4) : '9427';
  const shortAcc = transaction.accountNumber
    ? transaction.accountNumber.slice(-4)
    : '6157';

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'CBE Transaction Receipt',
          text: `CBE Transaction ID: ${transaction.referenceId} - ETB ${formatETB(transaction.amount)} paid to ${transaction.name}`,
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar select-none relative w-full h-full">
      {/* Top Purple Gradient Header */}
      <div className="relative bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] h-36 phone:h-42 px-5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] text-white shrink-0 flex items-start justify-between shadow-sm">
        <div className="flex items-center gap-3 phone:gap-3.5">
          <ShieldCheck className="w-8 h-8 phone:w-10 phone:h-10 text-white/95" />
          <div>
            <h2 className="text-[20px] phone:text-[23px] font-bold tracking-tight leading-tight">Thank you</h2>
            <p className="text-[12px] phone:text-[13.5px] text-purple-200 font-medium">Success</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 phone:w-9.5 phone:h-9.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white/90 transition"
          aria-label="Scan or Close"
        >
          <Scan className="w-4 h-4 phone:w-5 phone:h-5" />
        </button>

        {/* Circular Success Checkmark Overlapping Purple and White sections */}
        <div className="absolute -bottom-9 phone:-bottom-11 left-1/2 -translate-x-1/2 w-18 h-18 phone:w-22 phone:h-22 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 z-10">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#76169B] to-[#941FAE] flex items-center justify-center text-white shadow-inner">
            <Check className="w-9 h-9 phone:w-11 phone:h-11 stroke-[3.5]" />
          </div>
        </div>
      </div>

      {/* Main Content Area: balanced vertical spacing */}
      <div className="p-4.5 phone:p-6 pt-12 phone:pt-15 flex-1 flex flex-col items-center max-w-[500px] mx-auto w-full">
        <h3 className="text-[14px] phone:text-[16px] font-semibold text-[#29212E] text-center mb-3.5 phone:mb-4">
          Transaction Completed Successfully!
        </h3>

        {/* Transaction Summary Card */}
        <div className="w-full bg-[#F7F7F9] border border-[#ECECEF] rounded-[20px] phone:rounded-[26px] p-4 phone:p-6 text-[#29212E] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="text-[10.5px] phone:text-[12px] font-bold text-[#96939A] uppercase tracking-wider mb-2.5">
            TRANSACTION SUMMARY
          </div>

          <p className="text-[13px] phone:text-[14.5px] leading-relaxed text-[#29212E]/90 font-normal">
            ETB{' '}
            <strong className="text-[#29212E] font-bold">
              {formatETB(transaction.amount)}
            </strong>{' '}
            has been debited from{' '}
            <strong className="text-[#29212E] font-bold">{senderName}</strong> ETB-{senderLast4} for{' '}
            <strong className="text-[#29212E] font-bold">{transaction.name}</strong>{' '}
            <span>ETB-{shortAcc}</span> on{' '}
            <strong className="text-[#29212E] font-bold">{transaction.date}</strong> with
            transaction ID:{' '}
            <strong className="text-[#29212E] font-bold font-mono">
              {transaction.referenceId}
            </strong>
            . Reason: <span className="font-semibold text-[#29212E]">{transaction.remark || 'MB transfer'}</span>
          </p>

          <div className="mt-3 pt-2 text-[11px] phone:text-[12.5px] leading-relaxed text-[#96939A] border-t border-[#ECECEF]">
            Total Amount Debited: ETB{formatETB(transaction.amount)} with Service Charge
            of ETB0.00, VAT (15%) of 0.0 and Disaster Recovery (5%) of ETB0.00.
          </div>


          {/* Centered QR Code */}
          <div className="flex justify-center my-3.5 phone:my-5">
            <div className="bg-white p-2.5 phone:p-3.5 rounded-xl phone:rounded-2xl border border-[#ECECEF] shadow-2xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Receipt QR Code"
                  className="w-32 h-32 phone:w-44 phone:h-44 object-contain"
                />
              ) : (
                <div className="w-32 h-32 phone:w-44 phone:h-44 flex items-center justify-center bg-neutral-100 rounded text-neutral-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
          </div>

          {/* CBE Bank Footer */}
          <div className="pt-3 phone:pt-4 border-t border-dashed border-[#ECECEF] flex items-center gap-2.5 phone:gap-3">
            <div className="w-9 h-9 phone:w-11 phone:h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/10 p-0.5">
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
              <h4 className="text-[12.5px] phone:text-[14px] font-bold text-[#29212E] leading-tight">
                Commercial Bank of Ethiopia
              </h4>
              <p className="text-[10px] phone:text-[11.5px] text-[#96939A] font-normal">
                The bank you can always rely on!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row: Receipt, Screenshot, Share */}
        <div className="w-full flex items-center justify-around text-[#29212E] mt-5 phone:mt-6 px-4">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <ReceiptIcon className="w-4 h-4 phone:w-5 phone:h-5 text-[#29212E]" />
            <span>Receipt</span>
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <Maximize2 className="w-4 h-4 phone:w-5 phone:h-5 text-[#29212E]" />
            <span>Screenshot</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <Share2 className="w-4 h-4 phone:w-5 phone:h-5 text-[#29212E]" />
            <span>Share</span>
          </button>
        </div>

        {/* Dedicated Full-Width Close Pill Button */}
        <div className="w-full px-2 mt-4 phone:mt-5 mb-4">
          <button
            onClick={onClose}
            className="w-full h-11 phone:h-13 rounded-full bg-[#ECECEF] hover:bg-[#E0E0E5] active:scale-[0.99] text-[#29212E] font-semibold text-[14px] phone:text-[16px] transition shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
