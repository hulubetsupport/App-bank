import React, { useState } from 'react';
import { Delete, X } from 'lucide-react';
import { playChime } from '../utils/audio.ts';
import { validatePassword, DEFAULT_AUTH_PIN } from '../utils/banking.ts';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    playChime('tap');
    setErrorText('');
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4 || next.length === 6) {
        // Check if matching 0607 or standard 6-digit confirmation
        if (next === DEFAULT_AUTH_PIN || next === '060700' || next.length === 6) {
          playChime('success');
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    playChime('tap');
    setPin((prev) => prev.slice(0, -1));
    setErrorText('');
  };

  const handleQuickPin = () => {
    playChime('tap');
    setPin(DEFAULT_AUTH_PIN);
    setTimeout(() => {
      playChime('success');
      setPin('');
      onSuccess();
    }, 200);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] p-5 pb-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>
        <div className="relative text-center mb-4">
          <h3 className="text-sm font-bold text-neutral-800">
            Enter your PIN to confirm
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-neutral-400 hover:text-neutral-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 PIN Dots */}
        <div className="flex items-center justify-center gap-3.5 my-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <span
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 border-[#7C21A4] transition-all ${
                idx < pin.length ? 'bg-[#7C21A4] scale-110' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Quick hint for 0607 */}
        <div className="text-center mb-3">
          <button
            onClick={handleQuickPin}
            className="text-[11px] font-semibold text-[#7C21A4] hover:underline"
          >
            Quick PIN: <span className="font-mono">0607</span>
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[290px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-11 rounded-xl bg-[#EAE6DB] hover:bg-[#ded7c8] active:scale-95 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-11 rounded-xl bg-[#EAE6DB] hover:bg-red-50 text-red-600 transition flex items-center justify-center"
            aria-label="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-11 rounded-xl bg-[#EAE6DB] hover:bg-[#ded7c8] active:scale-95 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={onClose}
            className="h-11 rounded-xl bg-[#EAE6DB] hover:bg-neutral-200 text-xs font-bold text-neutral-600 transition flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
