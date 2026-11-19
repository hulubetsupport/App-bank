import React from 'react';
import { Recipient } from '../types/index.ts';
import { formatETB, maskAccountNumber, calculateCharges } from '../utils/banking.ts';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipient: Recipient;
  amount: number;
  senderName: string;
  senderAccount?: string;
  senderBalance?: number;
  applyStandardFees?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipient,
  amount,
  senderName,
  senderAccount = '1000758204567',
  applyStandardFees = false,
}) => {
  if (!isOpen) return null;

  const charges = calculateCharges(amount, applyStandardFees);

  return (
    <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[28px] phone:rounded-t-[32px] px-6 phone:px-7 pt-3 pb-7 phone:pb-9 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#D8D6DD] rounded-full mx-auto mb-4"></div>
        <h3 className="text-[16px] phone:text-[18px] font-bold text-center text-[#29212E] mb-5">
          Please Confirm
        </h3>

        <div className="divide-y divide-[#ECECEF]">
          <div className="py-3.5 flex items-start justify-between text-xs phone:text-sm">
            <span className="text-[#8E8B94] font-medium">From</span>
            <div className="text-right">
              <div className="font-semibold text-[#29212E] text-[13.5px] phone:text-[15px]">
                {senderName}
              </div>
              <div className="text-[11.5px] phone:text-xs text-[#8E8B94] font-mono mt-0.5 tabular-nums">
                {maskAccountNumber(senderAccount)}
              </div>
            </div>
          </div>

          <div className="py-3.5 flex items-start justify-between text-xs phone:text-sm">
            <span className="text-[#8E8B94] font-medium">To</span>
            <div className="text-right">
              <div className="font-semibold text-[#29212E] text-[13.5px] phone:text-[15px]">
                {recipient.name}
              </div>
              <div className="text-[11.5px] phone:text-xs text-[#8E8B94] font-mono mt-0.5 tabular-nums">
                {recipient.masked || recipient.accountNumber}
              </div>
            </div>
          </div>

          {applyStandardFees && (
            <div className="py-2.5 flex items-center justify-between text-[11.5px] phone:text-xs">
              <span className="text-[#8E8B94] font-medium">Service Charge + VAT + DR</span>
              <span className="font-mono font-semibold text-[#29212E] tabular-nums">
                {formatETB(charges.serviceCharge + charges.vat + charges.disasterRecovery)} ETB
              </span>
            </div>
          )}

          <div className="pt-4 pb-1 flex items-center justify-between">
            <span className="text-[13px] phone:text-[14.5px] text-[#29212E] font-medium">
              Total Amount
            </span>
            <div className="text-[22px] phone:text-[26px] font-bold text-[#7B1FA2] tabular-nums">
              {formatETB(charges.totalDebited)}{' '}
              <span className="text-sm phone:text-base font-bold">ETB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 phone:gap-4 mt-6 phone:mt-7">
          <button
            onClick={onClose}
            className="flex-1 h-12 phone:h-13 rounded-full bg-[#ECEAEF] hover:bg-[#E1DEE7] text-[#E04C47] text-[13.5px] phone:text-[15px] font-bold transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#76169B] to-[#8E24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] text-white text-[13.5px] phone:text-[15px] font-bold shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
