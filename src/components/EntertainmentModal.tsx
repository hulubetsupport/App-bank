import React, { useState } from 'react';
import {
  X,
  Film,
  Ticket,
  Tv,
  Gamepad2,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface EntertainmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessPayEntertainment: (amount: number, eventName: string, ticketCount: number) => void;
}

export const EntertainmentModal: React.FC<EntertainmentModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessPayEntertainment,
}) => {
  const [entCategory, setEntCategory] = useState<'cinema' | 'events' | 'sports' | 'parks'>('cinema');
  const [eventName, setEventName] = useState('Alem Cinema - New Amharic Movie');
  const [ticketCount, setTicketCount] = useState(2);
  const [ticketPrice] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const events = [
    { cat: 'cinema', name: 'Alem Cinema - VIP Hall', price: 200 },
    { cat: 'cinema', name: 'Edna Mall 3D Cinema', price: 250 },
    { cat: 'cinema', name: 'Century Cinema (Bole)', price: 180 },
    { cat: 'events', name: 'Addis Music Festival (Millennium Hall)', price: 600 },
    { cat: 'sports', name: 'Ethiopian Premier League: St. George vs Bunna', price: 150 },
    { cat: 'parks', name: 'Unity Park & Science Museum Entry', price: 300 },
  ];

  const filteredEvents = events.filter((e) => e.cat === entCategory);

  const totalAmount = ticketCount * ticketPrice;

  const handlePay = () => {
    if (totalAmount <= 0 || totalAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPayEntertainment(totalAmount, eventName, ticketCount);
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
              <Film className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Entertainment &amp; Tickets
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">መዝናኛ፣ ሲኒማ እና ቲኬቶች</p>
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
          {/* Category Tabs */}
          <div className="flex p-1 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setEntCategory('cinema');
                setEventName('Alem Cinema - VIP Hall');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                entCategory === 'cinema' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Cinema
            </button>
            <button
              type="button"
              onClick={() => {
                setEntCategory('events');
                setEventName('Addis Music Festival (Millennium Hall)');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                entCategory === 'events' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => {
                setEntCategory('sports');
                setEventName('Ethiopian Premier League: St. George vs Bunna');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                entCategory === 'sports' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Sports
            </button>
            <button
              type="button"
              onClick={() => {
                setEntCategory('parks');
                setEventName('Unity Park & Science Museum Entry');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                entCategory === 'parks' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Parks
            </button>
          </div>

          {/* Event Selector */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF] space-y-3">
            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Select Venue / Movie / Match
              </label>
              <div className="space-y-1.5">
                {filteredEvents.map((ev) => (
                  <button
                    key={ev.name}
                    type="button"
                    onClick={() => setEventName(ev.name)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                      eventName === ev.name
                        ? 'border-[#7B1FA2] bg-[#F7F2FA] text-[#7B1FA2] font-bold'
                        : 'border-[#ECECEF] bg-white text-[#29212E] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{ev.name}</span>
                    <span className="font-mono">{ev.price} ETB/ea</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Counter */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ECECEF]">
              <div>
                <div className="text-xs font-bold text-[#29212E]">Number of Tickets</div>
                <div className="text-[11px] text-[#96939A]">{ticketPrice} ETB per person</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-[#ECECEF] font-bold text-sm text-[#29212E] flex items-center justify-center hover:bg-neutral-50 active:scale-95"
                >
                  -
                </button>
                <span className="font-bold font-mono text-base text-[#29212E]">{ticketCount}</span>
                <button
                  type="button"
                  onClick={() => setTicketCount(ticketCount + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#ECECEF] font-bold text-sm text-[#29212E] flex items-center justify-center hover:bg-neutral-50 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ECECEF]">
              <span className="text-xs font-bold text-[#29212E]">Total Ticket Price</span>
              <span className="text-lg font-bold font-mono text-[#7B1FA2]">
                {formatETB(totalAmount)} ETB
              </span>
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
            disabled={isSubmitting || totalAmount <= 0 || totalAmount > balance}
            className="w-full h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-98 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Issuing E-Tickets...</span>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                <span>Buy Tickets ({formatETB(totalAmount)} ETB)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
