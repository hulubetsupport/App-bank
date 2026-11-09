import React, { useState } from 'react';
import {
  X,
  Store,
  QrCode,
  CheckCircle2,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface PayMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessPayMerchant: (amount: number, merchantName: string, tillNumber: string) => void;
}

export const PayMerchantModal: React.FC<PayMerchantModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessPayMerchant,
}) => {
  const [tillNumber, setTillNumber] = useState('584920');
  const [merchantName, setMerchantName] = useState('Friendship Supermarket (Bole Branch)');
  const [amount, setAmount] = useState('450');
  const [billNumber, setBillNumber] = useState('INV-88219');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickMerchants = [
    { code: '584920', name: 'Friendship Supermarket (Bole)' },
    { code: '691024', name: 'Edna Mall Entertainment' },
    { code: '319082', name: 'All Mart Hypermarket' },
    { code: '849120', name: 'Kaldis Coffee (Bole Medhanialem)' },
  ];

  const handleSelectMerchant = (m: { code: string; name: string }) => {
    setTillNumber(m.code);
    setMerchantName(m.name);
  };

  const handleTillChange = (val: string) => {
    setTillNumber(val);
    const found = quickMerchants.find((m) => m.code === val);
    if (found) {
      setMerchantName(found.name);
    } else if (val.length >= 6) {
      setMerchantName('Verified CBE Merchant #' + val);
    } else {
      setMerchantName('');
    }
  };

  const numAmount = Number(amount) || 0;

  const handlePay = () => {
    if (numAmount <= 0 || numAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPayMerchant(numAmount, merchantName || 'CBE Merchant', tillNumber);
      onClose();
    }, 800);
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
              <Store className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Pay Merchant
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የነጋዴ እና ሱቅ ክፍያ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F9] hover:bg-[#ECECEF] text-[#96939A] hover:text-[#29212E] flex items-center justify-center transition"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Body downwards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 phone:p-6 space-y-4">
          {/* Quick Verified Merchants */}
          <div>
            <label className="text-xs font-bold text-[#29212E] uppercase tracking-wider block mb-2">
              Popular Verified Merchants
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickMerchants.map((m) => (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => handleSelectMerchant(m)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    tillNumber === m.code
                      ? 'border-[#7B1FA2] bg-[#F7F2FA] text-[#7B1FA2]'
                      : 'border-[#ECECEF] bg-[#F7F7F9] text-[#29212E] hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-bold truncate">{m.name.split(' (')[0]}</div>
                  <div className="text-[10px] text-[#96939A] font-mono">Till: {m.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Till / Merchant Number Input */}
          <div className="bg-[#F7F7F9] rounded-2xl p-3.5 border border-[#ECECEF]">
            <label className="text-xs font-bold text-[#29212E] block mb-1">
              Merchant Till / Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={tillNumber}
                onChange={(e) => handleTillChange(e.target.value)}
                placeholder="Enter 6-digit merchant code..."
                className="w-full h-11 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-sm font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>

            {merchantName && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#159B75] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.4]" />
                <span className="truncate">{merchantName}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-[#29212E] uppercase tracking-wider block mb-1.5">
              Payment Amount (ETB)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-12 px-4 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-base font-bold text-[#29212E] focus:outline-none focus:border-[#7B1FA2] font-mono"
            />
          </div>

          {/* Bill / Invoice # */}
          <div>
            <label className="text-xs font-bold text-[#29212E] block mb-1">
              Bill / Invoice Reference (Optional)
            </label>
            <input
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Receipt / Order #"
              className="w-full h-10 px-3.5 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
            />
          </div>

          {/* Available Balance Reveal */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[#EBF6EE] rounded-xl text-xs border border-[#159B75]/20">
            <span className="text-[#159B75] font-semibold">Available Account Balance</span>
            <span className="font-bold font-mono text-[#159B75]">{formatETB(balance)} ETB</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#ECECEF] bg-white">
          <button
            onClick={handlePay}
            disabled={isSubmitting || numAmount <= 0 || numAmount > balance}
            className="w-full h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-98 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Payment...</span>
            ) : (
              <>
                <span>Pay Merchant {numAmount > 0 ? `${formatETB(numAmount)} ETB` : ''}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
