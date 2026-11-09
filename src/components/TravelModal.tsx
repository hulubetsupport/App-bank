import React, { useState } from 'react';
import {
  X,
  Plane,
  Train,
  Bus,
  Car,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessPayTravel: (amount: number, serviceName: string, bookingRef: string) => void;
}

export const TravelModal: React.FC<TravelModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessPayTravel,
}) => {
  const [category, setCategory] = useState<'flight' | 'train' | 'bus' | 'ride'>('flight');
  const [provider, setProvider] = useState('Ethiopian Airlines');
  const [bookingRef, setBookingRef] = useState('ET-892401');
  const [passengerName, setPassengerName] = useState('Aymen Kemal Ali');
  const [amount, setAmount] = useState('3450');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'flight', label: 'Flights', icon: Plane, defaultProvider: 'Ethiopian Airlines', defaultRef: 'ET-892401', defaultAmt: '3450' },
    { id: 'train', label: 'Train', icon: Train, defaultProvider: 'Ethio-Djibouti Railway', defaultRef: 'EDR-31092', defaultAmt: '680' },
    { id: 'bus', label: 'Intercity Bus', icon: Bus, defaultProvider: 'Selam Bus Express', defaultRef: 'SB-55102', defaultAmt: '850' },
    { id: 'ride', label: 'Ride / Taxi', icon: Car, defaultProvider: 'Feres / Ride Ethiopia', defaultRef: 'TAXI-WALLET', defaultAmt: '300' },
  ];

  const handleSelectCategory = (c: typeof categories[0]) => {
    setCategory(c.id as any);
    setProvider(c.defaultProvider);
    setBookingRef(c.defaultRef);
    setAmount(c.defaultAmt);
  };

  const numAmount = Number(amount) || 0;

  const handlePay = () => {
    if (numAmount <= 0 || numAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPayTravel(numAmount, provider, bookingRef);
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
              <Plane className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Travel &amp; Transport
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የጉዞ እና ትራንስፖርት ክፍያ</p>
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
          {/* Categories Grid */}
          <div className="grid grid-cols-4 gap-2">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCategory(c)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'border-[#7B1FA2] bg-[#F7F2FA] text-[#7B1FA2] shadow-xs'
                      : 'border-[#ECECEF] bg-[#F7F7F9] text-[#29212E] hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  <span className="text-[11px] font-bold leading-none">{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Provider & Booking Details */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF] space-y-3">
            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Travel Operator / Airline
              </label>
              <div className="font-semibold text-sm text-[#7B1FA2] bg-white px-3 py-2 rounded-xl border border-[#ECECEF]">
                {provider}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                PNR / Booking Reference / Ticket #
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="e.g. ET-892401"
                className="w-full h-11 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-sm font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Passenger Name
              </label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full h-10 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Ticket Amount (ETB)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-base font-bold text-[#29212E] font-mono focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>
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
              <span>Confirming Booking...</span>
            ) : (
              <>
                <span>Pay Ticket ({numAmount > 0 ? `${formatETB(numAmount)} ETB` : ''})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
