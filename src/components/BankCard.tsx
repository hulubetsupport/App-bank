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
  return (
    <div className="px-4 mt-1 z-10 shrink-0 select-none">
      <div className="relative overflow-hidden rounded-[24px] bg-[#181818] text-[#dfba6c] p-4.5 pt-4 shadow-xl border border-white/10">
        {/* Subtle background texture pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#baa069_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Card Header */}
        <div className="relative flex items-center gap-3">
          <img
            src={OFFICIAL_CBE_LOGO}
            alt="CBE"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-sm"
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

        {/* Balance Row */}
        <div className="relative my-3.5 flex items-center justify-center">
          <div className="flex items-baseline gap-1.5 text-center">
            {isMasked ? (
              <span className="text-2xl font-bold tracking-[4px] text-white font-mono">
                ******
              </span>
            ) : (
              <span className="text-[26px] font-extrabold tracking-tight text-white font-mono">
                {formatETB(balance)}
              </span>
            )}
            <span className="text-xs font-semibold text-[#dfba6c] ml-1">ETB</span>
          </div>

          <button
            onClick={onToggleMask}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white transition"
            aria-label={isMasked ? 'Show balance' : 'Hide balance'}
          >
            {isMasked ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Account Number Row */}
        <div className="relative flex items-center justify-center gap-2 text-xs text-[#d1c8a5] tracking-wide">
          <span>{accountName}</span>
          <span className="font-mono font-medium">{accountNumber}</span>
          <button
            onClick={onCopyAccount}
            className="p-1 hover:text-white transition text-neutral-400"
            title="Copy Account Number"
            aria-label="Copy account number"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Timestamp */}
        <div className="relative text-center text-[10px] text-[#7a8486] mt-2 font-mono">
          {lastUpdated}
        </div>
      </div>
    </div>
  );
};
