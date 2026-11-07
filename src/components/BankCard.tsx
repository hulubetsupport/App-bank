import React from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { formatETB } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.svg';

interface BankCardProps {
  balance: number;
  isMasked: boolean;
  onToggleMask: () => void;
  accountName: string;
  accountNumber: string;
  lastUpdated: string;
  onCopyAccount: () => void;
  copied: boolean;
}

export const BankCard: React.FC<BankCardProps> = ({
  balance,
  isMasked,
  onToggleMask,
  accountName,
  accountNumber,
  lastUpdated,
  onCopyAccount,
  copied,
}) => {
  // Masked format: "1 **** 9427"
  const maskedDisplay =
    accountNumber.length > 4
      ? `${accountNumber.charAt(0)} **** ${accountNumber.slice(-4)}`
      : accountNumber;

  return (
    <div className="mx-4 z-10 shrink-0 select-none">
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2c3b4e] via-[#222e3d] to-[#18222d] text-[#dfba6c] p-3.5 shadow-xl border border-white/10 min-h-[130px] flex flex-col justify-between">
        {/* Subtle authentic CBE curved watermark guilloche pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 360 140"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-20,130 C70,70 150,190 270,90 C330,40 370,80 410,50"
              stroke="#dfba6c"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M-20,100 C80,40 160,160 280,60 C340,10 380,50 420,20"
              stroke="#dfba6c"
              strokeWidth="1"
              fill="none"
            />
            {/* Concentric spiral rings representing CBE logo rays */}
            <circle cx="320" cy="40" r="75" stroke="#dfba6c" strokeWidth="0.8" opacity="0.35" />
            <circle cx="320" cy="40" r="55" stroke="#dfba6c" strokeWidth="0.8" opacity="0.3" />
            <circle cx="320" cy="40" r="35" stroke="#dfba6c" strokeWidth="0.8" opacity="0.2" />
          </svg>
        </div>

        {/* 1. Header: Round 44px CBE logo + Bank name + Tagline */}
        <div className="relative flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/20 p-0.5 border border-[#dfba6c]/30 shadow-inner">
            <img
              src={cbeLogo}
              alt="Commercial Bank of Ethiopia"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                // Fallback to local svg path if bundler alias differs
                e.currentTarget.src = './cbe-logo.svg';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-[#dfba6c] tracking-tight leading-tight truncate">
              Commercial Bank of Ethiopia
            </h3>
            <p className="text-[10px] text-[#baa069] mt-0.5 font-mono leading-none tracking-normal">
              The bank you can always rely on!
            </p>
          </div>
        </div>

        {/* 2. Big Balance (32px bold) + small "ETB" + Eye toggle on right */}
        <div className="relative my-1.5 flex items-center justify-center">
          <div className="flex items-baseline gap-1.5 text-center">
            {isMasked ? (
              <span className="text-[30px] font-bold tracking-[4px] text-white font-mono leading-none">
                ******
              </span>
            ) : (
              <span className="text-[32px] font-bold tracking-tight text-white leading-none drop-shadow-sm font-sans">
                {formatETB(balance)}
              </span>
            )}
            <span className="text-[13px] font-bold text-[#dfba6c] ml-1">ETB</span>
          </div>

          <button
            onClick={onToggleMask}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-300 hover:text-white transition active:scale-90"
            aria-label={isMasked ? 'Reveal balance & account' : 'Hide balance & account'}
          >
            {isMasked ? (
              <EyeOff className="w-5 h-5 stroke-[2.3]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[2.3]" />
            )}
          </button>
        </div>

        {/* 3. Account row: "Wadiah Ordinary 1 **** 9427" (or full when unmasked) + copy icon */}
        <div className="relative flex items-center justify-center gap-2 text-[12px] text-[#d8cfa8]">
          <span className="font-medium">{accountName}</span>
          <span className="font-mono font-semibold tracking-wider">
            {isMasked ? maskedDisplay : accountNumber}
          </span>
          <button
            onClick={onCopyAccount}
            className="p-1 hover:text-white transition text-neutral-300 active:scale-90"
            title="Copy Account Number"
            aria-label="Copy account number"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.4]" />
            ) : (
              <Copy className="w-3.5 h-3.5 stroke-[2.3]" />
            )}
          </button>
        </div>

        {/* 4. Small centered date/time at the bottom */}
        <div className="relative text-center text-[10px] text-[#8e989b] font-mono leading-tight mt-1">
          {lastUpdated}
        </div>
      </div>
    </div>
  );
};
