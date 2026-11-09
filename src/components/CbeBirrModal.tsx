import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface CbeBirrModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessTransfer: (amount: number, phone: string, recipientName: string, serviceType: string) => void;
}

export const CbeBirrModal: React.FC<CbeBirrModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessTransfer,
}) => {
  const [serviceType, setServiceType] = useState<'transfer' | 'cashin' | 'cashout'>('transfer');
  const [phoneNumber, setPhoneNumber] = useState('0912345678');
  const [recipientName, setRecipientName] = useState('Solomon Girma (CBE Birr)');
  const [amount, setAmount] = useState('200');
  const [remark, setRemark] = useState('CBE Birr Transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [100, 200, 500, 1000, 2000];

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (val.length >= 10) {
      setRecipientName('Solomon Girma (CBE Birr Verified)');
    } else {
      setRecipientName('');
    }
  };

  const numAmount = Number(amount) || 0;

  const handleSubmit = () => {
    if (numAmount <= 0 || numAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessTransfer(
        numAmount,
        phoneNumber,
        recipientName || 'CBE Birr Wallet',
        serviceType === 'transfer' ? 'Transfer to CBE Birr' : serviceType === 'cashin' ? 'CBE Birr Cash In' : 'CBE Birr Cash Out'
      );
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
              <Wallet className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                CBEBirr Services
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">ሲቢኢ ብር የሞባይል ዋሌት</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F9] hover:bg-[#ECECEF] text-[#96939A] hover:text-[#29212E] flex items-center justify-center transition"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Scrollable Body extending downwards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 phone:p-6 space-y-4">
          {/* Service Selector Tabs */}
          <div className="flex p-1 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setServiceType('transfer')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                serviceType === 'transfer' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Transfer to Wallet
            </button>
            <button
              type="button"
              onClick={() => setServiceType('cashin')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                serviceType === 'cashin' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Cash In
            </button>
            <button
              type="button"
              onClick={() => setServiceType('cashout')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                serviceType === 'cashout' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Cash Out
            </button>
          </div>

          {/* CBE Birr Phone Number Input */}
          <div className="bg-[#F7F7F9] rounded-2xl p-3.5 border border-[#ECECEF]">
            <label className="text-xs font-bold text-[#29212E] block mb-1.5">
              CBEBirr Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="09... / 07..."
                className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-[#ECECEF] text-sm font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
              <Smartphone className="w-4 h-4 text-[#96939A] absolute left-3.5 top-3.5" />
            </div>

            {recipientName && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#159B75] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.4]" />
                <span>Verified: {recipientName}</span>
              </div>
            )}
          </div>

          {/* Amount Input & Quick Chips */}
          <div>
            <label className="text-xs font-bold text-[#29212E] uppercase tracking-wider block mb-1.5">
              Amount (ETB)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter transfer amount in ETB..."
              className="w-full h-12 px-4 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-base font-bold text-[#29212E] focus:outline-none focus:border-[#7B1FA2] font-mono"
            />

            <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 transition ${
                    amount === q.toString()
                      ? 'bg-[#7B1FA2] text-white border-[#7B1FA2]'
                      : 'bg-white text-[#29212E] border-[#ECECEF] hover:bg-neutral-50'
                  }`}
                >
                  {q} ETB
                </button>
              ))}
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className="text-xs font-bold text-[#29212E] block mb-1">
              Remark / Reason
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full h-10 px-3.5 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
            />
          </div>

          {/* Available Account Balance Reveal */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[#EBF6EE] rounded-xl text-xs border border-[#159B75]/20">
            <span className="text-[#159B75] font-semibold">Source Account Available Balance</span>
            <span className="font-bold font-mono text-[#159B75]">{formatETB(balance)} ETB</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#ECECEF] bg-white">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || numAmount <= 0 || numAmount > balance}
            className="w-full h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-98 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing Transfer...</span>
            ) : (
              <>
                <span>Send to CBEBirr ({numAmount > 0 ? `${formatETB(numAmount)} ETB` : ''})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
