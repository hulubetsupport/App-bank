import React, { useState } from 'react';
import {
  X,
  Landmark,
  FileText,
  DollarSign,
  CreditCard,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface BankingServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onNavigateToTransactions: () => void;
}

export const BankingServicesModal: React.FC<BankingServicesModalProps> = ({
  isOpen,
  onClose,
  balance,
  onNavigateToTransactions,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'forex' | 'cheque' | 'statements'>('all');
  const [orderChequeSuccess, setOrderChequeSuccess] = useState(false);

  if (!isOpen) return null;

  const forexRates = [
    { code: 'USD', name: 'US Dollar', buy: '125.40', sell: '127.90', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', buy: '136.20', sell: '138.90', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', buy: '162.50', sell: '165.75', flag: '🇬🇧' },
    { code: 'AED', name: 'UAE Dirham', buy: '34.15', sell: '34.85', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', buy: '33.40', sell: '34.05', flag: '🇸🇦' },
  ];

  const handleOrderCheque = () => {
    setOrderChequeSuccess(true);
    setTimeout(() => setOrderChequeSuccess(false), 3000);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] max-h-[92vh] flex flex-col shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        {/* Handle */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#E5DFD7] rounded-full mx-auto"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-2.5 flex items-center justify-between border-b border-[#ECECEF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#7B1FA2]">
              <Landmark className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Banking Services
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የባንክ አገልግሎቶች</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F9] hover:bg-[#ECECEF] text-[#96939A] hover:text-[#29212E] flex items-center justify-center transition"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Scrollable Content Downwards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 phone:p-6 space-y-4">
          {/* Account Balance Banner */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] rounded-2xl text-white shadow-xs">
            <div>
              <div className="text-[11px] text-white/80 font-medium">Available Account Balance</div>
              <div className="text-[18px] phone:text-[20px] font-bold font-mono">
                {formatETB(balance)} <span className="font-sans text-xs">ETB</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigateToTransactions();
              }}
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold active:scale-95 transition"
            >
              Statement
            </button>
          </div>

          {/* Service Categories Downwards */}

          {/* 1. Account & Statements */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">
                Statements &amp; Proof
              </span>
              <FileText className="w-4 h-4 text-[#7B1FA2]" />
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTransactions();
                }}
                className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-xl flex items-center justify-between text-left border border-[#ECECEF] transition"
              >
                <div>
                  <div className="text-xs font-semibold text-[#29212E]">Mini Statement</div>
                  <div className="text-[10.5px] text-[#96939A]">View your recent 10 transactions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#96939A]" />
              </button>

              <button
                onClick={() => alert('Full Account Statement request submitted to your registered email.')}
                className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-xl flex items-center justify-between text-left border border-[#ECECEF] transition"
              >
                <div>
                  <div className="text-xs font-semibold text-[#29212E]">Full Statement (PDF)</div>
                  <div className="text-[10.5px] text-[#96939A]">Export 6-month certified statement</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#96939A]" />
              </button>
            </div>
          </div>

          {/* 2. Live Forex Exchange Rates */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">
                CBE Daily Forex Rates
              </span>
              <DollarSign className="w-4 h-4 text-[#7B1FA2]" />
            </div>

            <div className="bg-white rounded-xl border border-[#ECECEF] overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-[#F7F7F9] px-3 py-1.5 font-bold text-[#96939A] text-[11px] border-b border-[#ECECEF]">
                <div>Currency</div>
                <div className="text-right">Buy (ETB)</div>
                <div className="text-right">Sell (ETB)</div>
              </div>
              <div className="divide-y divide-[#ECECEF]">
                {forexRates.map((r) => (
                  <div key={r.code} className="grid grid-cols-3 px-3 py-2 items-center">
                    <div className="flex items-center gap-1.5">
                      <span>{r.flag}</span>
                      <span className="font-bold text-[#29212E]">{r.code}</span>
                    </div>
                    <div className="text-right font-mono text-[#29212E]">{r.buy}</div>
                    <div className="text-right font-mono text-[#7B1FA2] font-semibold">{r.sell}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Cheque Services */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">
                Cheque Services
              </span>
              <CreditCard className="w-4 h-4 text-[#7B1FA2]" />
            </div>

            {orderChequeSuccess ? (
              <div className="p-3 bg-[#EBF6EE] border border-[#159B75]/30 rounded-xl text-center text-xs text-[#159B75] font-semibold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Cheque book request submitted successfully!</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOrderCheque}
                  className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl border border-[#ECECEF] text-left transition"
                >
                  <div className="text-xs font-semibold text-[#29212E]">Order Cheque Book</div>
                  <div className="text-[10px] text-[#96939A]">50 Leaves / Regular</div>
                </button>
                <button
                  onClick={() => alert('Stop Cheque service requested for your account.')}
                  className="p-2.5 bg-white hover:bg-neutral-50 rounded-xl border border-[#ECECEF] text-left transition"
                >
                  <div className="text-xs font-semibold text-[#29212E]">Stop Payment</div>
                  <div className="text-[10px] text-[#96939A]">Freeze issued cheque</div>
                </button>
              </div>
            )}
          </div>

          {/* 4. CBE Noor / Interest-Free Banking */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#29212E] uppercase tracking-wider">
                CBE Noor &amp; Fixed Deposits
              </span>
              <Layers className="w-4 h-4 text-[#7B1FA2]" />
            </div>
            <p className="text-[11px] text-[#96939A] mb-2 leading-relaxed">
              Open Wadiah and Mudarabah Sharia-compliant accounts or Fixed-Time deposits directly from your mobile app.
            </p>
            <button
              onClick={() => alert('CBE Noor Fixed Term Application opened for branch confirmation.')}
              className="w-full py-2 bg-white hover:bg-neutral-50 rounded-xl border border-[#ECECEF] text-xs font-bold text-[#7B1FA2] transition"
            >
              Open New Term Deposit
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-[#ECECEF]">
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
