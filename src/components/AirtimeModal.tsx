import React, { useState } from 'react';
import {
  X,
  Phone,
  Wifi,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface AirtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessRecharge: (amount: number, phone: string, provider: string, packageType: string) => void;
}

export const AirtimeModal: React.FC<AirtimeModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessRecharge,
}) => {
  const [provider, setProvider] = useState<'ethio' | 'safaricom'>('ethio');
  const [packageType, setPackageType] = useState<'airtime' | 'voice' | 'data'>('airtime');
  const [phoneNumber, setPhoneNumber] = useState('0911009427');
  const [isMyNumber, setIsMyNumber] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [25, 50, 100, 200, 500, 1000];

  const handleSelectQuick = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(Number(val));
    }
  };

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleRecharge = () => {
    if (finalAmount <= 0 || finalAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessRecharge(
        finalAmount,
        phoneNumber,
        provider === 'ethio' ? 'Ethio telecom' : 'Safaricom Ethiopia',
        packageType === 'airtime' ? 'Airtime Recharge' : packageType === 'voice' ? 'Voice Package' : 'Internet Data'
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
              <Phone className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Airtime &amp; Packages
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የሞባይል ካርድ እና ፓኬጅ</p>
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
          {/* Provider Selector */}
          <div>
            <label className="text-xs font-bold text-[#29212E] uppercase tracking-wider block mb-2">
              Select Telecom Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('ethio')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition ${
                  provider === 'ethio'
                    ? 'border-[#7B1FA2] bg-[#F7F2FA] text-[#7B1FA2] shadow-xs'
                    : 'border-[#ECECEF] bg-[#F7F7F9] text-[#29212E]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#008A38] text-white flex items-center justify-center text-[10px] font-black">
                  ET
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[13px] font-bold leading-tight truncate">Ethio telecom</div>
                  <div className="text-[10px] text-[#96939A]">ኢትዮ ቴሌኮም</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('safaricom')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition ${
                  provider === 'safaricom'
                    ? 'border-[#7B1FA2] bg-[#F7F2FA] text-[#7B1FA2] shadow-xs'
                    : 'border-[#ECECEF] bg-[#F7F7F9] text-[#29212E]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#E60000] text-white flex items-center justify-center text-[10px] font-black">
                  SF
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[13px] font-bold leading-tight truncate">Safaricom</div>
                  <div className="text-[10px] text-[#96939A]">ሳፋሪኮም</div>
                </div>
              </button>
            </div>
          </div>

          {/* Package Type Pills */}
          <div>
            <div className="flex p-1 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPackageType('airtime')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  packageType === 'airtime' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
                }`}
              >
                Airtime Top-Up
              </button>
              <button
                type="button"
                onClick={() => setPackageType('voice')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  packageType === 'voice' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
                }`}
              >
                Voice Pack
              </button>
              <button
                type="button"
                onClick={() => setPackageType('data')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  packageType === 'data' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
                }`}
              >
                Data Pack
              </button>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="bg-[#F7F7F9] rounded-2xl p-3.5 border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#29212E]">Mobile Number</span>
              <button
                type="button"
                onClick={() => {
                  if (isMyNumber) {
                    setPhoneNumber('');
                    setIsMyNumber(false);
                  } else {
                    setPhoneNumber('0911009427');
                    setIsMyNumber(true);
                  }
                }}
                className="text-[11px] font-semibold text-[#7B1FA2] hover:underline"
              >
                {isMyNumber ? 'Use Another Number' : 'Use My Number'}
              </button>
            </div>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09... or 07..."
                className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-[#ECECEF] text-sm font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
              <Smartphone className="w-4 h-4 text-[#96939A] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Denominations Grid */}
          <div>
            <label className="text-xs font-bold text-[#29212E] uppercase tracking-wider block mb-2">
              Select Amount (ETB)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuick(amt)}
                  className={`h-11 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-[#7B1FA2] text-white border-[#7B1FA2] shadow-xs'
                      : 'bg-[#F7F7F9] text-[#29212E] border-[#ECECEF] hover:bg-neutral-100'
                  }`}
                >
                  <span>{amt} ETB</span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mt-2.5">
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="Or enter custom amount in ETB..."
                className="w-full h-11 px-4 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs phone:text-sm text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>
          </div>

          {/* Available Balance Reveal */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[#EBF6EE] rounded-xl text-xs border border-[#159B75]/20">
            <span className="text-[#159B75] font-semibold">Available Account Balance</span>
            <span className="font-bold font-mono text-[#159B75]">{formatETB(balance)} ETB</span>
          </div>
        </div>

        {/* Recharge Action Button */}
        <div className="p-4 border-t border-[#ECECEF] bg-white">
          <button
            onClick={handleRecharge}
            disabled={isSubmitting || finalAmount <= 0 || finalAmount > balance}
            className="w-full h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-98 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing Recharge...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Recharge {finalAmount > 0 ? `${finalAmount} ETB` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
