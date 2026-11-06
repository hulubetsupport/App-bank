import React from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { formatETB, OFFICIAL_CBE_LOGO } from '../utils/banking.ts';

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
  // Format masked representation: e.g. "1 **** 9427" matching screenshot IMG_20261106_230128_031_6cb96595.jpg
  const maskedDisplay =
    accountNumber.length > 4
      ? `${accountNumber.charAt(0)} **** ${accountNumber.slice(-4)}`
      : accountNumber;

  return (
    <div className="px-4 mt-1 z-10 shrink-0 select-none">
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2c3b4e] via-[#222e3d] to-[#18222d] text-[#dfba6c] p-4.5 pt-4 shadow-xl border border-white/10">
        {/* Authentic CBE subtle curved watermark & geometric guilloche pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 360 180"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-20,150 C70,90 150,210 270,110 C330,60 370,100 410,70"
              stroke="#dfba6c"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M-20,120 C80,60 160,180 280,80 C340,30 380,70 420,40"
              stroke="#dfba6c"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M-20,180 C60,120 140,240 260,140 C320,90 360,130 400,100"
              stroke="#dfba6c"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Concentric spiral rings representing CBE logo rays */}
            <circle cx="310" cy="50" r="85" stroke="#dfba6c" strokeWidth="0.8" opacity="0.3" />
            <circle cx="310" cy="50" r="65" stroke="#dfba6c" strokeWidth="0.8" opacity="0.25" />
            <circle cx="310" cy="50" r="45" stroke="#dfba6c" strokeWidth="0.8" opacity="0.2" />
            <circle cx="310" cy="50" r="25" stroke="#dfba6c" strokeWidth="0.8" opacity="0.15" />
          </svg>
        </div>

        {/* Card Header */}
        <div className="relative flex items-center gap-3">
          <img
            src={OFFICIAL_CBE_LOGO}
            alt="Commercial Bank of Ethiopia"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-md"
          />
          <div>
            <h3 className="text-[13.5px] font-bold text-[#dfba6c] tracking-wide leading-tight">
              Commercial Bank of Ethiopia
            </h3>
            <p className="text-[10px] text-[#baa069] mt-0.5 font-light">
              The bank you can always rely on!
            </p>
          </div>
        </div>

        {/* Balance Row with bold font & synchronized eye toggle */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="flex items-baseline gap-1.5 text-center">
            {isMasked ? (
              <span className="text-2xl font-black tracking-[4px] text-white font-mono">
                ******
              </span>
            ) : (
              <span className="text-[27px] font-black tracking-tight text-white font-mono drop-shadow-sm">
                {formatETB(balance)}
              </span>
            )}
            <span className="text-xs font-bold text-[#dfba6c] ml-1">ETB</span>
          </div>

          <button
            onClick={onToggleMask}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-300 hover:text-white transition"
            aria-label={isMasked ? 'Reveal balance & account' : 'Hide balance & account'}
          >
            {isMasked ? (
              <EyeOff className="w-5 h-5 stroke-[2.3]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[2.3]" />
            )}
          </button>
        </div>

        {/* Account Row: Reveals along with balance when unmasked */}
        <div className="relative flex items-center justify-center gap-2 text-xs text-[#d8cfa8] tracking-wide">
          <span className="font-medium">{accountName}</span>
          <span className="font-mono font-bold tracking-wider">
            {isMasked ? maskedDisplay : accountNumber}
          </span>
          <button
            onClick={onCopyAccount}
            className="p-1 hover:text-white transition text-neutral-300"
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

        {/* Timestamp */}
        <div className="relative text-center text-[10px] text-[#8e989b] mt-2 font-mono">
          {lastUpdated}
        </div>
      </div>
    </div>
  );
};
