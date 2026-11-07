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
    <div className="w-full max-w-[500px] mx-auto px-4 phone:px-5 z-10 shrink-0 select-none">
      <div className="relative overflow-hidden rounded-[28px] phone:rounded-[32px] bg-gradient-to-br from-[#171717] via-[#202020] to-[#263343] text-[#E8D184] p-5 phone:p-6 pb-3.5 phone:pb-4.5 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.45)] border border-white/10 min-h-[148px] phone:min-h-[174px] flex flex-col justify-between">
        {/* Custom SVG Decorative Background: curved gold wave lines, concentric circles, dotted texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 380 150"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cbeDotGrid"
                width="14"
                height="14"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="0.8" fill="#D4B15C" opacity="0.14" />
              </pattern>
              <linearGradient id="cbeGoldWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8D184" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#D4B15C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#C9B779" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Dotted World Map Network Texture */}
            <rect width="100%" height="100%" fill="url(#cbeDotGrid)" />

            {/* Smooth curved gold wave lines extending across the card */}
            <path
              d="M-20,135 C60,65 150,185 260,85 C320,35 360,75 410,45"
              stroke="url(#cbeGoldWave)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M-30,105 C70,45 160,155 270,60 C330,15 370,55 420,25"
              stroke="url(#cbeGoldWave)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0,150 C90,85 190,170 300,95 C350,55 390,85 430,65"
              stroke="url(#cbeGoldWave)"
              strokeWidth="0.8"
              fill="none"
            />

            {/* Concentric Decorative Rings */}
            <circle cx="335" cy="42" r="82" stroke="#D4B15C" strokeWidth="0.8" opacity="0.22" />
            <circle cx="335" cy="42" r="60" stroke="#D4B15C" strokeWidth="0.75" opacity="0.18" />
            <circle cx="335" cy="42" r="38" stroke="#D4B15C" strokeWidth="0.75" opacity="0.14" />
            <circle cx="335" cy="42" r="18" stroke="#D4B15C" strokeWidth="0.6" opacity="0.1" />
          </svg>
        </div>

        {/* 1. Header: Gold CBE Logo + Bank Name + Subtitle */}
        <div className="relative flex items-center gap-3 phone:gap-3.5">
          <div className="w-[42px] h-[42px] phone:w-[48px] phone:h-[48px] rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/30 p-0.5 border border-[#D4B15C]/30 shadow-inner">
            <img
              src={cbeLogo}
              alt="Commercial Bank of Ethiopia"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = './cbe-logo.svg';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14.5px] phone:text-[16px] phone-lg:text-[17px] font-bold text-[#E8D184] tracking-tight leading-tight truncate">
              Commercial Bank of Ethiopia
            </h3>
            <p className="text-[10px] phone:text-[11px] text-[#C9B779] mt-0.5 font-sans leading-none tracking-normal">
              The bank you can always rely on!
            </p>
          </div>
        </div>

        {/* 2. Balance Row: Default VISIBLE + ETB + Synchronized Eye Toggle */}
        <div className="relative my-2 phone:my-3 flex items-center justify-center">
          <div className="flex items-baseline gap-1.5 text-center">
            {isMasked ? (
              <span className="text-[28px] phone:text-[33px] font-bold tracking-[5px] text-white font-mono leading-none">
                ******
              </span>
            ) : (
              <span className="text-[30px] phone:text-[34px] phone-lg:text-[37px] font-bold tracking-tight text-white leading-none drop-shadow-sm font-sans">
                {formatETB(balance)}
              </span>
            )}
            <span className="text-[13px] phone:text-[14.5px] font-bold text-[#E8D184] ml-1">ETB</span>
          </div>

          <button
            onClick={onToggleMask}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 phone:p-2.5 text-neutral-300 hover:text-white transition active:scale-90"
            aria-label={isMasked ? 'Reveal balance' : 'Hide balance'}
            title={isMasked ? 'Reveal balance' : 'Hide balance'}
          >
            {isMasked ? (
              <EyeOff className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2.2] text-[#C9B779] hover:text-[#E8D184]" />
            ) : (
              <Eye className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2.2] text-[#C9B779] hover:text-[#E8D184]" />
            )}
          </button>
        </div>

        {/* 3. Account Row: Holder Name + Account Number + Copy Button */}
        <div className="relative flex items-center justify-center gap-2 phone:gap-2.5 text-[12px] phone:text-[13.5px] text-[#E8D184]/90">
          <span className="font-medium text-white/90">{accountName}</span>
          <span className="font-mono font-semibold tracking-wider text-[#E8D184]">
            {isMasked ? maskedDisplay : accountNumber}
          </span>
          <button
            onClick={onCopyAccount}
            className="p-1 hover:text-white transition text-neutral-300 active:scale-90"
            title="Copy Account Number"
            aria-label="Copy account number"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 phone:w-4 phone:h-4 text-[#159B75] stroke-[2.4]" />
            ) : (
              <Copy className="w-3.5 h-3.5 phone:w-4 phone:h-4 stroke-[2.2] text-[#C9B779] hover:text-white" />
            )}
          </button>
        </div>

        {/* 4. Timestamp */}
        <div className="relative text-center text-[10px] phone:text-[11px] text-neutral-400 font-mono leading-tight mt-1">
          {lastUpdated}
        </div>
      </div>
    </div>
  );
};
