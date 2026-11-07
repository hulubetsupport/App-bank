import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountNumber: string;
  accountName: string;
  userName: string;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({
  isOpen,
  onClose,
  accountNumber,
  accountName,
  userName,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const qrData = `CBE-RECEIVE|ACC:${accountNumber}|NAME:${userName}|TYPE:${accountName}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(qrData, {
        width: 220,
        margin: 1,
        color: {
          dark: '#1e1e1e',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(''));
    }
  }, [isOpen, qrData]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] p-5 phone:p-7 pb-8 phone:pb-10 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#E5DFD7] rounded-full mx-auto mb-3 phone:mb-4"></div>

        <div className="flex items-center justify-between pb-2.5 phone:pb-3.5 border-b border-[#ECECEF]">
          <div className="flex items-center gap-2.5 phone:gap-3">
            <div className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-[#EBF6EE] text-[#64A878] flex items-center justify-center">
              <QrCode className="w-4.5 h-4.5 phone:w-5 phone:h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[14px] phone:text-[16px] font-bold text-[#29212E]">Receive Money</h3>
              <p className="text-[10.5px] phone:text-[12px] text-[#96939A]">Share QR Code or Account Details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#96939A] hover:text-[#29212E] p-1.5 rounded-full transition active:scale-90"
          >
            <X className="w-5 h-5 phone:w-5.5 phone:h-5.5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="my-4 phone:my-6 flex flex-col items-center">
          <div className="p-3 phone:p-4 bg-white border border-[#ECECEF] rounded-[20px] phone:rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Receive QR Code" className="w-38 h-38 phone:w-48 phone:h-48 object-contain" />
            ) : (
              <div className="w-38 h-38 phone:w-48 phone:h-48 flex items-center justify-center bg-neutral-100 rounded text-neutral-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <h4 className="text-[14px] phone:text-[16px] font-bold text-[#29212E] mt-3 phone:mt-4">{userName}</h4>
          <p className="text-[11px] phone:text-[12.5px] text-[#96939A]">{accountName}</p>
        </div>

        {/* Account Pill */}
        <div className="bg-[#F7F7F9] border border-[#ECECEF] rounded-[18px] phone:rounded-[22px] p-3.5 phone:p-4.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] phone:text-[11px] text-[#96939A] font-semibold uppercase tracking-wider">
              Account Number
            </div>
            <div className="text-[14px] phone:text-[16px] font-bold text-[#29212E] font-mono mt-0.5">
              {accountNumber}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 phone:px-4.5 py-1.5 phone:py-2 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-95 text-white text-xs phone:text-sm font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 phone:w-4 phone:h-4 stroke-[2.4]" /> : <Copy className="w-3.5 h-3.5 phone:w-4 phone:h-4 stroke-[2.2]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
