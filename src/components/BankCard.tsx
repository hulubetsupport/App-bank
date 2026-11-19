import React from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { formatETB } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.png';

interface BankCardProps {
  balance: number;
  isMasked: boolean;
  onToggleMask: () => void;
  accountName: string;
  accountNumber: string;
  lastUpdated: string;
  onCopyAccount: () => void;
  copied: boolean;
  onOpenBalanceModal?: () => void;
  showWorldMap?: boolean;
  cardIndex?: number;
  totalCards?: number;
  onSelectCardIndex?: (idx: number) => void;
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
  onOpenBalanceModal,
  showWorldMap = true,
  cardIndex = 0,
  totalCards = 1,
  onSelectCardIndex,
}) => {
  const maskedDisplay =
    accountNumber.length > 4
      ? `${accountNumber.charAt(0)} **** ${accountNumber.slice(-4)}`
      : accountNumber;

  const dotCount = Math.max(totalCards, 2);

  return (
    <div className="w-full max-w-[500px] mx-auto px-4 phone:px-5 z-10 shrink-0 select-none">
      <div className="relative overflow-hidden rounded-[24px] phone:rounded-[28px] bg-gradient-to-br from-[#161719] via-[#1E2023] to-[#262F38] text-[#E8D184] px-4.5 phone:px-5.5 pt-4 phone:pt-5 pb-3.5 phone:pb-4 shadow-[0_14px_32px_-8px_rgba(0,0,0,0.45)] border border-white/10 min-h-[154px] phone:min-h-[176px] flex flex-col justify-between">
        {/* Decorative Low-Opacity Dotted World Map + Subtle Gold Curves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {showWorldMap && (
            <img
              src="./assets/aistudio/images__8__5a7a5f2c.jpeg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-[0.17] invert contrast-150 mix-blend-screen scale-[1.06]"
              onError={(e) => {
                e.currentTarget.src = '/assets/aistudio/images__8__5a7a5f2c.jpeg';
              }}
            />
          )}

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 380 150"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cbeGoldWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8D184" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#D4B15C" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C9B779" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            <path
              d="M-20,135 C60,65 150,185 260,85 C320,35 360,75 410,45"
              stroke="url(#cbeGoldWave)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M-30,105 C70,45 160,155 270,60 C330,15 370,55 420,25"
              stroke="url(#cbeGoldWave)"
              strokeWidth="0.9"
              fill="none"
            />

            <circle cx="338" cy="40" r="78" stroke="#D4B15C" strokeWidth="0.7" opacity="0.14" />
            <circle cx="338" cy="40" r="56" stroke="#D4B15C" strokeWidth="0.7" opacity="0.1" />
          </svg>
        </div>

        {/* 1. Header: Standalone Gold CBE Logo + Bank Name + Tagline */}
        <div className="relative flex items-center gap-3 phone:gap-3.5">
          <div className="w-[42px] h-[42px] phone:w-[48px] phone:h-[48px] shrink-0 flex items-center justify-center">
            <img
              src={cbeLogo}
              alt="Commercial Bank of Ethiopia"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = './cbe-logo.png';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14.5px] phone:text-[16px] font-bold text-[#E8C56C] tracking-tight leading-tight truncate">
              Commercial Bank of Ethiopia
            </h3>
            <p className="text-[10px] phone:text-[11px] text-[#C9B779] mt-0.5 leading-none tracking-normal">
              The bank you can always rely on!
            </p>
          </div>
        </div>

        {/* 2. Balance Row */}
        <div className="relative my-2.5 phone:my-3 flex items-center justify-center">
          <div
            onClick={onOpenBalanceModal}
            className={`flex items-baseline gap-1.5 text-center ${
              onOpenBalanceModal ? 'cursor-pointer hover:opacity-90 active:scale-98 transition' : ''
            }`}
            title="View Account Details & Breakdown"
          >
            {isMasked ? (
              <span className="text-[26px] phone:text-[31px] font-bold tracking-[5px] text-white font-mono leading-none tabular-nums">
                ******
              </span>
            ) : (
              <span className="text-[28px] phone:text-[33px] font-bold tracking-tight text-white leading-none drop-shadow-sm tabular-nums">
                {formatETB(balance)}
              </span>
            )}
            <span className="text-[13px] phone:text-[14px] font-bold text-white/95 ml-1">ETB</span>
          </div>

          <button
            onClick={onToggleMask}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-300 hover:text-white transition active:scale-90"
            aria-label={isMasked ? 'Reveal balance' : 'Hide balance'}
            title={isMasked ? 'Reveal balance' : 'Hide balance'}
          >
            {isMasked ? (
              <EyeOff className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2] text-[#A9A6AD] hover:text-white" />
            ) : (
              <Eye className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2] text-[#E8D184] hover:text-white" />
            )}
          </button>
        </div>

        {/* 3. Account Row + Copy */}
        <div className="relative flex items-center justify-center gap-2 text-[12px] phone:text-[13.5px] text-[#E8D184]/90">
          <span className="font-medium text-[#E8C56C] tracking-tight">{accountName}</span>
          <span className="font-mono font-semibold tracking-wider text-[#E8D184] tabular-nums">
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
              <Copy className="w-3.5 h-3.5 phone:w-4 phone:h-4 stroke-[2] text-[#B8A985] hover:text-white" />
            )}
          </button>
        </div>

        {/* 4. Timestamp */}
        <div className="relative text-center text-[10px] phone:text-[11px] text-neutral-400 font-medium leading-tight mt-1 tabular-nums">
          {lastUpdated}
        </div>
      </div>

      {/* Pagination Indicator Dots matching reference Screenshot */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-0.5">
        {Array.from({ length: dotCount }).map((_, idx) => {
          const active = idx === cardIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCardIndex?.(idx)}
              aria-label={`Select account card ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                active ? 'w-6 bg-[#B89748]' : 'w-1.5 bg-[#D4B15C]/45 hover:bg-[#D4B15C]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
