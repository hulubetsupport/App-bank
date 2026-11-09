import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  Landmark,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.svg';

interface AccountBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  userName: string;
  accountName: string;
  accountNumber: string;
  onNavigateToTransactions: () => void;
  onNavigateToTransfer: () => void;
}

export const AccountBalanceModal: React.FC<AccountBalanceModalProps> = ({
  isOpen,
  onClose,
  balance,
  userName,
  accountName,
  accountNumber,
  onNavigateToTransactions,
  onNavigateToTransfer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dailyLimit = 100000.0;
  const utilizedToday = 5.0;
  const remainingDaily = dailyLimit - utilizedToday;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] max-h-[90vh] flex flex-col shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        {/* Handle */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#E5DFD7] rounded-full mx-auto"></div>
        </div>

        {/* Header */}
        <div className="relative px-6 py-2 flex items-center justify-between border-b border-[#ECECEF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#7B1FA2]">
              <Landmark className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Account Balance &amp; Details
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የሂሳብ ዝርዝር መረጃ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F9] hover:bg-[#ECECEF] text-[#96939A] hover:text-[#29212E] flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Scrollable spacious content downwards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 phone:p-6 space-y-4">
          {/* Gold & Dark Card Balance Summary */}
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#171717] via-[#222222] to-[#2B3544] p-5 text-white shadow-md border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black/40 p-0.5 border border-[#D4B15C]/40 flex items-center justify-center">
                  <img src={cbeLogo} alt="CBE" className="w-full h-full object-contain rounded-full" />
                </div>
                <div>
                  <div className="text-[11px] text-[#E8D184] font-medium leading-none">Commercial Bank of Ethiopia</div>
                  <div className="text-[13px] font-bold text-white mt-0.5">{accountName}</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#159B75]/20 text-[#159B75] text-[10.5px] font-bold border border-[#159B75]/30">
                <ShieldCheck className="w-3 h-3 stroke-[2.4]" />
                <span>Active</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[11px] text-white/70 uppercase tracking-wider font-semibold">Available Balance</div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[28px] phone:text-[32px] font-bold text-white font-sans tracking-tight">
                  {formatETB(balance)}
                </span>
                <span className="text-[14px] font-bold text-[#E8D184]">ETB</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11.5px] text-white/80 bg-white/5 rounded-xl px-3 py-2">
              <span className="font-mono text-[#E8D184]">{accountNumber}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-[#E8D184] hover:text-white transition font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#159B75]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Balance Breakdown downward details */}
          <div className="bg-[#F7F7F9] rounded-[22px] p-4.5 border border-[#ECECEF] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECECEF]">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">Balance Breakdown</span>
              <span className="text-[11px] text-[#7B1FA2] font-semibold">Real-Time</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Ledger / Actual Balance</span>
              <span className="font-bold text-[#29212E] font-mono">{formatETB(balance)} ETB</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Available Balance</span>
              <span className="font-bold text-[#159B75] font-mono">{formatETB(balance)} ETB</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Uncleared Effects</span>
              <span className="font-medium text-[#29212E] font-mono">0.00 ETB</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Blocked / Lien Amount</span>
              <span className="font-medium text-[#29212E] font-mono">0.00 ETB</span>
            </div>
          </div>

          {/* Daily Limits downward details */}
          <div className="bg-[#F7F7F9] rounded-[22px] p-4.5 border border-[#ECECEF] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECECEF]">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">Daily Transfer Limits</span>
              <span className="text-[11px] text-[#96939A]">24h Rolling</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Daily Transfer Limit</span>
              <span className="font-semibold text-[#29212E] font-mono">{formatETB(dailyLimit)} ETB</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm">
              <span className="text-[#96939A]">Utilized Today</span>
              <span className="font-semibold text-[#E65C57] font-mono">{formatETB(utilizedToday)} ETB</span>
            </div>

            <div className="flex items-center justify-between text-xs phone:text-sm pt-1 border-t border-[#ECECEF]">
              <span className="text-[#29212E] font-semibold">Remaining Daily Limit</span>
              <span className="font-bold text-[#7B1FA2] font-mono">{formatETB(remainingDaily)} ETB</span>
            </div>
          </div>

          {/* Account Profile info downward */}
          <div className="bg-[#F7F7F9] rounded-[22px] p-4.5 border border-[#ECECEF] space-y-2.5 text-xs phone:text-sm">
            <div className="text-xs font-bold text-[#29212E] uppercase tracking-wider pb-1 border-b border-[#ECECEF]">
              Account Specification
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#96939A]">Account Holder</span>
              <span className="font-semibold text-[#29212E]">{userName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#96939A]">Branch</span>
              <span className="font-semibold text-[#29212E]">Addis Ababa Main (1000)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#96939A]">Currency</span>
              <span className="font-semibold text-[#29212E]">ETB (Ethiopian Birr)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#96939A]">Interest-Free Banking</span>
              <span className="font-semibold text-[#7B1FA2]">CBE Noor</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToTransactions();
              }}
              className="h-12 rounded-full bg-[#F3EBDD] hover:bg-[#eadeca] active:scale-95 text-[#7B1FA2] font-bold text-xs phone:text-sm flex items-center justify-center gap-1.5 transition"
            >
              <Clock className="w-4 h-4 stroke-[2.2]" />
              <span>Statement</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToTransfer();
              }}
              className="h-12 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-95 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.4]" />
              <span>Send Money</span>
            </button>
          </div>
        </div>

        {/* Close button at bottom */}
        <div className="p-4 pt-2 border-t border-[#ECECEF]">
          <button
            onClick={onClose}
            className="w-full h-11 phone:h-12 rounded-full bg-[#ECECEF] hover:bg-[#E0E0E5] active:scale-98 text-[#29212E] font-semibold text-xs phone:text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
