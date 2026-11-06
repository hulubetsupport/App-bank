import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Share2 } from 'lucide-react';

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

  if (!isOpen) return null;

  const qrData = `CBE-RECEIVE|ACC:${accountNumber}|NAME:${userName}|TYPE:${accountName}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    qrData
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] p-5 pb-7 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">Receive Money</h3>
              <p className="text-[10px] text-neutral-400">Share QR Code or Account Details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code */}
        <div className="my-4 flex flex-col items-center">
          <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-sm">
            <img src={qrUrl} alt="Receive QR Code" className="w-40 h-40 object-contain" />
          </div>

          <h4 className="text-sm font-bold text-neutral-900 mt-3">{userName}</h4>
          <p className="text-[11px] text-neutral-500">{accountName}</p>
        </div>

        {/* Account pill */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase">
              Account Number
            </div>
            <div className="text-sm font-bold text-neutral-900 font-mono">
              {accountNumber}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-full bg-[#7C21A4] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
