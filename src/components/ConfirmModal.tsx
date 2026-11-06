import React from 'react';
import { Recipient } from '../types/index.ts';
import { formatETB, maskAccountNumber } from '../utils/banking.ts';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipient: Recipient;
  amount: number;
  senderName: string;
  senderAccount?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipient,
  amount,
  senderName,
  senderAccount = '1000562339427',
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-sm font-bold text-center text-neutral-800 mb-6">
          Please Confirm
        </h3>

        <div className="space-y-5">
          <div className="flex items-start justify-between text-xs">
            <span className="text-neutral-400 font-medium">From</span>
            <div className="text-right">
              <div className="font-semibold text-neutral-800">{senderName}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                {maskAccountNumber(senderAccount)}
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between text-xs">
            <span className="text-neutral-400 font-medium">To</span>
            <div className="text-right">
              <div className="font-semibold text-neutral-800">{recipient.name}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                {recipient.masked || recipient.accountNumber}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Amount</span>
            <div className="text-xl font-extrabold text-[#7C21A4] font-mono">
              {formatETB(amount)} <span className="text-sm">ETB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#faedf0] hover:bg-[#f7dfe4] text-[#cf3a4b] text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-[#7C21A4] hover:bg-[#68198a] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
