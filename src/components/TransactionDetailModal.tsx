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
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Modal Top Bar */}
        <div className="relative flex items-center justify-center pb-2">
          <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
            TRANSACTION DETAIL
          </span>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-neutral-400 hover:text-neutral-700 p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mt-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Completed</span>
          </div>
        </div>

        {/* Amount & Receiver */}
        <div className="text-center my-2">
          <h2
            className={`text-2xl font-extrabold font-mono tracking-tight ${
              isCredit ? 'text-emerald-700' : 'text-neutral-900'
            }`}
          >
            {prefix}
            {formatETB(transaction.amount)} ETB
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">{actionText}</p>
        </div>

        {/* Details Table */}
        <div className="mt-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Date &amp; Time</span>
            <span className="text-neutral-800 font-semibold font-mono">
              {transaction.date}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Type</span>
            <span className="text-neutral-800 font-semibold">Account to Account</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Transaction ID</span>
            <div className="flex items-center gap-1.5 font-mono text-neutral-800 font-semibold">
              <span>{transaction.referenceId}</span>
              <button
                onClick={() => copyToClipboard(transaction.referenceId, 'txId')}
                className="text-neutral-400 hover:text-neutral-700 p-0.5"
                title="Copy Transaction ID"
              >
                {copiedField === 'txId' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Receipt ID</span>
            <div className="flex items-center gap-1.5 font-mono text-neutral-800 font-semibold text-[11px]">
              <span>{receiptId}</span>
              <button
                onClick={() => copyToClipboard(receiptId, 'rcptId')}
                className="text-neutral-400 hover:text-neutral-700 p-0.5"
                title="Copy Receipt ID"
              >
                {copiedField === 'rcptId' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Remark</span>
            <span className="text-neutral-800 font-semibold">
              {transaction.remark || 'MB Transfer'}
            </span>
          </div>
        </div>

        {/* View Receipt Button */}
        <div className="mt-7">
          <button
            onClick={() => onViewReceipt(transaction)}
            className="w-full h-11 rounded-full bg-[#7C21A4] hover:bg-[#68198a] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/20 transition tracking-wide uppercase"
          >
            <FileText className="w-4 h-4" />
            <span>VIEW RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
