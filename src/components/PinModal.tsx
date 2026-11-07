import React, { useState } from 'react';
import { Delete, X } from 'lucide-react';
import { validatePassword } from '../utils/banking.ts';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  pinLength: number;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  pinLength,
}) => {
  const [pin, setPin] = useState('');
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setErrorText('');
    if (pin.length < pinLength) {
      const next = pin + digit;
      setPin(next);
      if (next.length === pinLength) {
        if (validatePassword(next, correctPin)) {
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 150);
        } else {
          setErrorText('Incorrect PIN');
          setTimeout(() => {
            setPin('');
            setErrorText('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorText('');
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] p-5 phone:p-7 pb-7 phone:pb-9 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#E5DFD7] rounded-full mx-auto mb-3 phone:mb-4"></div>
        <div className="relative text-center mb-3 phone:mb-4">
          <h3 className="text-[14px] phone:text-[16px] font-bold text-[#29212E]">
            Enter your PIN to confirm
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-[#96939A] hover:text-[#29212E] p-1 phone:p-1.5 rounded-full transition"
          >
            <X className="w-4.5 h-4.5 phone:w-5 phone:h-5 stroke-[2]" />
          </button>
        </div>

        {/* Masked PIN Dots (password is never shown in plain text) */}
        <div className="flex items-center justify-center gap-3.5 phone:gap-4 my-3 phone:my-4">
          {Array.from({ length: pinLength }).map((_, idx) => (
            <span
              key={idx}
              className={`w-3.5 h-3.5 phone:w-4 phone:h-4 rounded-full border-2 border-[#7B1FA2] transition-all ${
                idx < pin.length ? 'bg-[#7B1FA2] scale-110 shadow-xs' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {errorText && (
          <p className="text-xs phone:text-sm text-[#E65C57] font-semibold text-center mb-2 phone:mb-3">
            {errorText}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 phone:gap-3 max-w-[280px] phone:max-w-[340px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-11 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-[#EFEFEF] active:scale-95 text-base phone:text-lg font-semibold text-[#29212E] transition flex items-center justify-center border border-[#ECECEF]"
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-11 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-red-50 text-[#E65C57] transition flex items-center justify-center border border-[#ECECEF] active:scale-95"
            aria-label="Backspace"
          >
            <Delete className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2]" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-11 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-[#EFEFEF] active:scale-95 text-base phone:text-lg font-semibold text-[#29212E] transition flex items-center justify-center border border-[#ECECEF]"
          >
            0
          </button>
          <button
            onClick={onClose}
            className="h-11 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-neutral-200 text-xs phone:text-sm font-bold text-[#96939A] transition flex items-center justify-center border border-[#ECECEF] active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
