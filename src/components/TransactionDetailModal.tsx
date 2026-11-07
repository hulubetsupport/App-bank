import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onViewReceipt: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onViewReceipt,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const isCredit = transaction.type === 'credited';
  const prefix = isCredit ? '+' : '-';
  const actionText = isCredit ? `from ${transaction.name}` : `to ${transaction.name}`;
  const receiptId = transaction.receiptId || 'v2-hfHCxNVvrTgUZ3k1kOTg';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] p-6 phone:p-8 pb-8 phone:pb-10 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#E5DFD7] rounded-full mx-auto mb-3 phone:mb-4"></div>

        {/* Modal Top Bar */}
        <div className="relative flex items-center justify-center pb-2">
          <span className="text-[11px] phone:text-xs font-bold tracking-wider text-[#96939A] uppercase">
            TRANSACTION DETAIL
          </span>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-[#96939A] hover:text-[#29212E] p-1 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5 phone:w-5 phone:h-5 stroke-[2]" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mt-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 phone:px-4 py-1 phone:py-1.5 rounded-full bg-[#EBF6EE] text-[#159B75] text-[11px] phone:text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 phone:w-4 phone:h-4 stroke-[2.4]" />
            <span>Completed</span>
          </div>
        </div>

        {/* Amount & Receiver */}
        <div className="text-center my-2 phone:my-3">
          <h2
            className={`text-2xl phone:text-3xl font-bold font-mono tracking-tight ${
              isCredit ? 'text-[#159B75]' : 'text-[#29212E]'
            }`}
          >
            {prefix}
            {formatETB(transaction.amount)} <span className="font-sans text-lg phone:text-xl">ETB</span>
          </h2>
          <p className="text-xs phone:text-sm text-[#96939A] mt-1 font-medium">{actionText}</p>
        </div>

        {/* Details Container */}
        <div className="mt-4 phone:mt-5 bg-[#F7F7F9] rounded-[20px] phone:rounded-[24px] p-4 phone:p-5 border border-[#ECECEF] space-y-3 phone:space-y-4 text-xs phone:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#96939A] font-medium">Date &amp; Time</span>
            <span className="text-[#29212E] font-semibold font-mono">
              {transaction.date}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#96939A] font-medium">Type</span>
            <span className="text-[#29212E] font-semibold">Account to Account</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#96939A] font-medium">Transaction ID</span>
            <div className="flex items-center gap-1.5 font-mono text-[#29212E] font-semibold">
              <span>{transaction.referenceId}</span>
              <button
                onClick={() => copyToClipboard(transaction.referenceId, 'txId')}
                className="text-[#96939A] hover:text-[#29212E] p-0.5"
                title="Copy Transaction ID"
              >
                {copiedField === 'txId' ? (
                  <Check className="w-3 h-3 phone:w-3.5 phone:h-3.5 text-[#159B75]" />
                ) : (
                  <Copy className="w-3 h-3 phone:w-3.5 phone:h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#96939A] font-medium">Receipt ID</span>
            <div className="flex items-center gap-1.5 font-mono text-[#29212E] font-semibold text-[11px] phone:text-xs">
              <span>{receiptId}</span>
              <button
                onClick={() => copyToClipboard(receiptId, 'rcptId')}
                className="text-[#96939A] hover:text-[#29212E] p-0.5"
                title="Copy Receipt ID"
              >
                {copiedField === 'rcptId' ? (
                  <Check className="w-3 h-3 phone:w-3.5 phone:h-3.5 text-[#159B75]" />
                ) : (
                  <Copy className="w-3 h-3 phone:w-3.5 phone:h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#96939A] font-medium">Remark</span>
            <span className="text-[#29212E] font-semibold">
              {transaction.remark || 'MB Transfer'}
            </span>
          </div>
        </div>

        {/* View Receipt Button */}
        <div className="mt-5 phone:mt-6">
          <button
            onClick={() => onViewReceipt(transaction)}
            className="w-full h-12 phone:h-14 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-[0.99] text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition tracking-wider uppercase"
          >
            <FileText className="w-4 h-4 phone:w-5 phone:h-5" />
            <span>VIEW RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
