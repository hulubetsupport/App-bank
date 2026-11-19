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
import cbeLogo from '../assets/cbe-logo.png';
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
  senderAccount = '1000758204567',
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [actionToast, setActionToast] = useState<string>('');

  const qrPayload = `CBE-TX|ID:${transaction.referenceId}|AMT:${transaction.amount}|FOR:${transaction.name}|DATE:${transaction.date}|RCPT:${transaction.receiptId}`;

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
      .catch(() => setQrDataUrl(''));
  }, [qrPayload]);

  const senderLast4 = senderAccount ? senderAccount.slice(-4) : '9427';
  const shortAcc = transaction.accountNumber
    ? transaction.accountNumber.slice(-4)
    : '6157';

  const serviceCharge = transaction.serviceCharge ?? 0;
  const vat = transaction.vat ?? 0;
  const disasterRecovery = transaction.disasterRecovery ?? 0;
  const totalDebited = Number(
    (transaction.amount + serviceCharge + vat + disasterRecovery).toFixed(2)
  );

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(''), 2200);
  };

  const handleShare = () => {
    const shareText = `CBE Transaction Receipt\nID: ${transaction.referenceId}\nAmount: ETB ${formatETB(
      transaction.amount
    )}\nRecipient: ${transaction.name}\nDate: ${transaction.date}`;
    if (navigator.share) {
      navigator
        .share({
          title: 'CBE Transaction Receipt',
          text: shareText,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      showToast('Receipt details copied to clipboard');
    }
  };

  const handleScreenshot = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `CBE-Receipt-${transaction.referenceId}.png`;
      link.click();
    }
    showToast('Receipt verification QR saved');
  };

  const handleDownloadReceipt = () => {
    const text = [
      'COMMERCIAL BANK OF ETHIOPIA',
      'Transaction Summary',
      `Transaction ID: ${transaction.referenceId}`,
      `Receipt ID: ${transaction.receiptId || 'N/A'}`,
      `From: ${senderName} (ETB-${senderLast4})`,
      `To: ${transaction.name} (ETB-${shortAcc})`,
      `Amount: ETB ${formatETB(transaction.amount)}`,
      `Service Charge: ETB ${formatETB(serviceCharge)}`,
      `VAT (15%): ETB ${formatETB(vat)}`,
      `Disaster Recovery (5%): ETB ${formatETB(disasterRecovery)}`,
      `Total Debited: ETB ${formatETB(totalDebited)}`,
      `Date: ${transaction.date}`,
      `Reason: ${transaction.remark || 'MB Transfer'}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CBE-Receipt-${transaction.referenceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Receipt file downloaded');
  };

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar select-none relative w-full h-full">
      {/* Top Purple Gradient Header matching IMG_20261106_230127_820 & screenshot_1793891629609 */}
      <div className="relative bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] h-36 phone:h-40 px-5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+14px)] text-white shrink-0 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 phone:w-9 phone:h-9 text-white/95" />
          <div>
            <h2 className="text-[20px] phone:text-[22px] font-bold tracking-tight leading-tight">
              Thank you
            </h2>
            <p className="text-[12px] phone:text-[13px] text-purple-100/90 font-normal">Success</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white/90 transition"
          aria-label="Close Receipt"
        >
          <Scan className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Overlapping Curved White Sheet + Centered Checkmark Badge */}
      <div className="relative -mt-6 bg-white rounded-t-[28px] px-4.5 phone:px-6 pt-12 phone:pt-14 pb-6 flex-1 flex flex-col items-center max-w-[500px] mx-auto w-full">
        {/* Circular Success Checkmark straddling purple/white edge */}
        <div className="absolute -top-9 phone:-top-10 left-1/2 -translate-x-1/2 w-18 h-18 phone:w-20 phone:h-20 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 z-10">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#76169B] to-[#941FAE] flex items-center justify-center text-white shadow-inner">
            <Check className="w-9 h-9 phone:w-10 phone:h-10 stroke-[3.5]" />
          </div>
        </div>

        <h3 className="text-[14px] phone:text-[15.5px] font-medium text-[#29212E] text-center mb-4">
          Transaction Completed Successfully!
        </h3>

        {/* Transaction Summary Card */}
        <div className="w-full bg-[#F3F3F5] border border-[#E8E8EC] rounded-[20px] phone:rounded-[24px] p-4.5 phone:p-5.5 text-[#29212E] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="text-[11.5px] phone:text-[12.5px] font-normal text-[#8E8B94] mb-2.5">
            Transaction Summary
          </div>

          <p className="text-[13px] phone:text-[14px] leading-relaxed text-[#29212E] font-normal">
            ETB{' '}
            <strong className="text-[#29212E] font-bold tabular-nums">
              {formatETB(transaction.amount)}
            </strong>{' '}
            has been {transaction.type === 'credited' ? 'credited to' : 'debited from'}{' '}
            <strong className="text-[#29212E] font-bold">{senderName}</strong> ETB-{senderLast4}{' '}
            {transaction.type === 'credited' ? 'from' : 'for'}{' '}
            <strong className="text-[#29212E] font-bold">{transaction.name}</strong>{' '}
            <span>ETB-{shortAcc}</span> on{' '}
            <strong className="text-[#29212E] font-bold">{transaction.date}</strong> with
            transaction ID:{' '}
            <strong className="text-[#29212E] font-bold font-mono">
              {transaction.referenceId}
            </strong>
            . Reason:{' '}
            <span className="font-medium text-[#29212E]">{transaction.remark || 'MB Transfer'}</span>
          </p>

          <div className="mt-2.5 text-[12px] phone:text-[13px] leading-relaxed text-[#3E3A43]">
            Total Amount {transaction.type === 'credited' ? 'Credited' : 'Debited'}: ETB
            <span className="tabular-nums">{formatETB(totalDebited)}</span> with Service Charge of
            ETB{formatETB(serviceCharge)}, VAT (15%) of {vat === 0 ? '0.0' : `ETB${formatETB(vat)}`}{' '}
            and Disaster Recovery (5%) of ETB{formatETB(disasterRecovery)}.
          </div>

          {/* Centered QR Code inside crisp dark-bordered rounded square */}
          <div className="flex justify-center my-4 phone:my-5">
            <div className="bg-white p-2 phone:p-2.5 rounded-2xl border-2 border-[#3E3A43]/60 shadow-2xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Receipt QR Code"
                  className="w-32 h-32 phone:w-40 phone:h-40 object-contain"
                />
              ) : (
                <div className="w-32 h-32 phone:w-40 phone:h-40 flex items-center justify-center bg-neutral-100 rounded text-neutral-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
          </div>

          {/* Standalone Gold CBE Emblem + Bank Title/Tagline */}
          <div className="pt-2 flex items-center gap-3">
            <div className="w-11 h-11 phone:w-12 phone:h-12 shrink-0 flex items-center justify-center">
              <img
                src={cbeLogo}
                alt="Commercial Bank of Ethiopia"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = './cbe-logo.png';
                }}
              />
            </div>
            <div>
              <h4 className="text-[13px] phone:text-[14px] font-bold text-[#29212E] leading-tight">
                Commercial Bank of Ethiopia
              </h4>
              <p className="text-[10.5px] phone:text-[11.5px] text-[#8E8B94] font-normal">
                The bank you can always rely on!
              </p>
            </div>
          </div>
        </div>

        {actionToast && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-[#29212E] text-white text-xs font-medium animate-in fade-in">
            {actionToast}
          </div>
        )}

        {/* Bottom Actions Row: Receipt, Screenshot, Share */}
        <div className="w-full flex items-center justify-around text-[#29212E] mt-5 phone:mt-6 px-4">
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <ReceiptIcon className="w-4 h-4 phone:w-4.5 phone:h-4.5 text-[#29212E]" />
            <span>Receipt</span>
          </button>

          <button
            onClick={handleScreenshot}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <Maximize2 className="w-4 h-4 phone:w-4.5 phone:h-4.5 text-[#29212E]" />
            <span>Screenshot</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 phone:gap-2 text-xs phone:text-sm font-semibold hover:text-[#7B1FA2] transition active:scale-95"
          >
            <Share2 className="w-4 h-4 phone:w-4.5 phone:h-4.5 text-[#29212E]" />
            <span>Share</span>
          </button>
        </div>

        {/* Close Pill Button */}
        <div className="w-full px-1 mt-4 phone:mt-5 mb-2">
          <button
            onClick={onClose}
            className="w-full h-11 phone:h-12.5 rounded-full bg-[#DCDCE0] hover:bg-[#D1D1D6] active:scale-[0.99] text-[#29212E] font-semibold text-[14px] phone:text-[15.5px] transition shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
