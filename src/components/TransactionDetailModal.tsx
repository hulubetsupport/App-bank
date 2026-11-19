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
    <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[28px] phone:rounded-t-[32px] px-6 phone:px-7 pt-3 pb-7 phone:pb-9 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#D8D6DD] rounded-full mx-auto mb-3"></div>

        {/* Modal Top Bar */}
        <div className="relative flex items-center justify-center pb-2">
          <span className="text-[11px] phone:text-xs font-semibold tracking-wider text-[#8E8B94] uppercase">
            TRANSACTION DETAIL
          </span>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-[#8E8B94] hover:text-[#29212E] p-1 rounded-full bg-[#F2F2F5] transition"
            aria-label="Close"
          >
            <X className="w-4 h-4 phone:w-4.5 phone:h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mt-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5EC] text-[#159B75] text-[11px] phone:text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.4]" />
            <span>Completed</span>
          </div>
        </div>

        {/* Amount & Counterparty */}
        <div className="text-center my-2 phone:my-3">
          <h2
            className={`text-[26px] phone:text-[30px] font-bold tracking-tight tabular-nums ${
              isCredit ? 'text-[#159B75]' : 'text-[#29212E]'
            }`}
          >
            {prefix}
            {formatETB(transaction.amount)} <span className="text-[20px] phone:text-[22px]">ETB</span>
          </h2>
          <p className="text-xs phone:text-sm text-[#8E8B94] mt-0.5 font-medium">{actionText}</p>
        </div>

        {/* Details Container matching IMG_20261106_230128_152 */}
        <div className="mt-4 space-y-3.5 text-[12.5px] phone:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#8E8B94] font-normal">Date &amp; Time</span>
            <span className="text-[#29212E] font-semibold tabular-nums">{transaction.date}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8B94] font-normal">Type</span>
            <span className="text-[#29212E] font-semibold capitalize">
              {transaction.category.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8B94] font-normal">Transaction ID</span>
            <div className="flex items-center gap-1.5 font-mono text-[#29212E] font-semibold text-xs">
              <span>{transaction.referenceId}</span>
              <button
                onClick={() => copyToClipboard(transaction.referenceId, 'txId')}
                className="text-[#96939A] hover:text-[#7B1FA2] p-0.5"
                title="Copy Transaction ID"
              >
                {copiedField === 'txId' ? (
                  <Check className="w-3.5 h-3.5 text-[#159B75]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8B94] font-normal">Receipt ID</span>
            <div className="flex items-center gap-1.5 font-mono text-[#29212E] font-semibold text-[11px] phone:text-xs">
              <span className="truncate max-w-[190px]">{receiptId}</span>
              <button
                onClick={() => copyToClipboard(receiptId, 'rcptId')}
                className="text-[#96939A] hover:text-[#7B1FA2] p-0.5"
                title="Copy Receipt ID"
              >
                {copiedField === 'rcptId' ? (
                  <Check className="w-3.5 h-3.5 text-[#159B75]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8E8B94] font-normal">Remark</span>
            <span className="text-[#29212E] font-semibold">
              {transaction.remark || 'MB Transfer'}
            </span>
          </div>
        </div>

        {/* View Receipt Pill Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onViewReceipt(transaction)}
            className="w-full max-w-[260px] h-11 phone:h-12 rounded-full bg-gradient-to-r from-[#76169B] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-[0.98] text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition tracking-wider uppercase"
          >
            <FileText className="w-4 h-4" />
            <span>VIEW RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
