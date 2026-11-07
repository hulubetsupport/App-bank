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
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] p-6 phone:p-8 pb-8 phone:pb-10 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#E5DFD7] rounded-full mx-auto mb-4"></div>
        <h3 className="text-[15px] phone:text-[17px] font-bold text-center text-[#29212E] mb-6">
          Please Confirm
        </h3>

        <div className="space-y-4 phone:space-y-5 bg-[#F7F7F9] rounded-[20px] phone:rounded-[24px] p-4 phone:p-5 border border-[#ECECEF]">
          <div className="flex items-start justify-between text-xs phone:text-sm">
            <span className="text-[#96939A] font-medium">From</span>
            <div className="text-right">
              <div className="font-semibold text-[#29212E] phone:text-base">{senderName}</div>
              <div className="text-[11px] phone:text-xs text-[#96939A] font-mono mt-0.5">
                {maskAccountNumber(senderAccount)}
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between text-xs phone:text-sm">
            <span className="text-[#96939A] font-medium">To</span>
            <div className="text-right">
              <div className="font-semibold text-[#29212E] phone:text-base">{recipient.name}</div>
              <div className="text-[11px] phone:text-xs text-[#96939A] font-mono mt-0.5">
                {recipient.masked || recipient.accountNumber}
              </div>
            </div>
          </div>

          <div className="pt-2 phone:pt-3 flex items-center justify-between border-t border-[#ECECEF]">
            <span className="text-xs phone:text-sm text-[#96939A] font-medium">Total Amount</span>
            <div className="text-xl phone:text-2xl font-bold text-[#7B1FA2] font-mono">
              {formatETB(amount)} <span className="text-sm phone:text-base font-sans">ETB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 phone:gap-4 mt-6 phone:mt-7">
          <button
            onClick={onClose}
            className="flex-1 h-12 phone:h-14 rounded-full bg-[#ECECEF] hover:bg-[#E0E0E5] text-[#29212E] text-xs phone:text-sm font-bold transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 phone:h-14 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] text-white text-xs phone:text-sm font-bold shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
