import React from 'react';
import { Recipient } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipient: Recipient;
  amount: number;
  senderName: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipient,
  amount,
  senderName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-base font-extrabold text-center text-neutral-800 mb-5">
          Please Confirm
        </h3>

        <div className="space-y-4">
          <div className="flex items-start justify-between text-xs">
            <span className="text-neutral-500 font-medium">From</span>
            <div className="text-right">
              <div className="font-bold text-neutral-800">{senderName}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                1*********9427
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between text-xs">
            <span className="text-neutral-500 font-medium">To</span>
            <div className="text-right">
              <div className="font-bold text-neutral-800">{recipient.name}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                {recipient.accountNumber}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Total Amount</span>
            <div className="text-xl font-extrabold text-[#7C21A4] font-mono">
              {formatETB(amount)} ETB
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition"
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
