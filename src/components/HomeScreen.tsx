import React, { useState } from 'react';
import {
  RefreshCw,
  Search,
  FileText,
  Banknote,
  Share2,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  ArrowLeftRight,
  Wallet,
  Receipt,
  Landmark,
  Building2,
  ScanLine,
} from 'lucide-react';
import { BankCard } from './BankCard.tsx';
import { ScreenType } from '../types/index.ts';

interface HomeScreenProps {
  balance: number;
  isBalanceMasked: boolean;
  onToggleMask: () => void;
  onNavigate: (screen: ScreenType) => void;
  userName: string;
  accountName?: string;
  accountNumber?: string;
  language: string;
  onToggleLanguage: () => void;
  onOpenGovernmentServices: () => void;
  onOpenReceiveModal: () => void;
  onOpenScanQr: () => void;
  copied: boolean;
  onCopyAccount: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  isBalanceMasked,
  onToggleMask,
  onNavigate,
  userName,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000562339427',
  language,
  onToggleLanguage,
  onOpenGovernmentServices,
  onOpenReceiveModal,
  onOpenScanQr,
  copied,
  onCopyAccount,
  onOpenSettings,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F3EC] select-none relative w-full">
      {/* CBE Purple Header with rounded bottom */}
      <header className="bg-[#7C21A4] px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-14 text-white shrink-0 rounded-b-[24px]">
        <div className="flex items-center justify-between">
          {/* Left: Grid icon in translucent circle, "Hello," over name */}
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-98 transition"
            title="Account Settings"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-[12px] text-purple-200">Hello,</div>
              <div className="text-[16px] font-bold tracking-tight text-white">
                {userName.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Right: English pill, refresh circle, search circle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[12px] font-medium flex items-center gap-1 transition"
            >
              <span>{language}</span>
              <span className="text-[9px]">▾</span>
            </button>

            <button
              onClick={handleRefresh}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition"
              aria-label="Refresh account"
            >
              <RefreshCw
                className={`w-4 h-4 stroke-[2.2] ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition"
              aria-label="Search transactions"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* CBE Card overlaps header by about half (-mt-12) */}
      <div className="-mt-11 z-10 shrink-0">
        <BankCard
          balance={balance}
          isMasked={isBalanceMasked}
          onToggleMask={onToggleMask}
          accountName={accountName}
          accountNumber={accountNumber}
          lastUpdated="06-Nov-26 10:52 PM"
          onCopyAccount={onCopyAccount}
          copied={copied}
        />
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2.5 pb-24">
        {/* Small handle pill under card */}
        <div className="w-9 h-1 rounded-full bg-[#d6c4b0] mx-auto mb-2.5 shrink-0"></div>

        {/* 4 Round Quick Actions (52px circles) + Chevron */}
        <div className="flex items-center justify-between px-0.5 mb-3.5">
          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1 w-[68px] group active:scale-95 transition"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition border border-neutral-100">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-medium text-neutral-800 leading-tight text-center">
              Mini Statement
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1 w-[68px] group active:scale-95 transition"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition border border-neutral-100">
              <Banknote className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-medium text-neutral-800 leading-tight text-center">
              Cash Out
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1 w-[68px] group active:scale-95 transition"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition border border-neutral-100">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-medium text-neutral-800 leading-tight text-center">
              Bill Share
            </span>
          </button>

          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1 w-[68px] group active:scale-95 transition"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition border border-neutral-100">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-medium text-neutral-800 leading-tight text-center">
              Cards
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-neutral-400 hover:text-neutral-700 active:scale-90 transition border border-neutral-100"
            aria-label="More quick actions"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Short Horizontal Tiles Side by Side (~56px high) */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Tile 1: CBE Transfer / Send Money */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[56px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex items-center gap-2.5 shadow-2xs border border-neutral-200/60 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-neutral-900 leading-tight truncate">
                CBE Transfer
              </div>
              <div className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5">
                Send Money
              </div>
            </div>
          </button>

          {/* Tile 2: Receive / Get Paid */}
          <button
            onClick={onOpenReceiveModal}
            className="h-[56px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex items-center gap-2.5 shadow-2xs border border-neutral-200/60 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <ArrowDownLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-neutral-900 leading-tight truncate">
                Receive
              </div>
              <div className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5">
                Get Paid
              </div>
            </div>
          </button>
        </div>

        {/* 2-Column Grid with 8px gap (Airtime, Other Transfers, CBEBirr, Bills & Utilities, Banking, Government Services) */}
        {/* Each tile is ~64px tall, radius 14px, icon 22px above label */}
        <div className="grid grid-cols-2 gap-2 pb-4">
          {/* 1: Airtime */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60"
          >
            <Phone className="w-[22px] h-[22px] text-[#7C21A4] fill-[#7C21A4]/15 stroke-[2.2]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              Airtime
            </span>
          </button>

          {/* 2: Other Transfers */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60"
          >
            <ArrowLeftRight className="w-[22px] h-[22px] text-[#7C21A4] stroke-[2.3]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              Other Transfers
            </span>
          </button>

          {/* 3: CBEBirr */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60"
          >
            <Wallet className="w-[22px] h-[22px] text-[#7C21A4] fill-[#7C21A4]/15 stroke-[2.2]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              CBEBirr
            </span>
          </button>

          {/* 4: Bills & Utilities */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60"
          >
            <Receipt className="w-[22px] h-[22px] text-[#7C21A4] stroke-[2.2]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              Bills &amp; Utilities
            </span>
          </button>

          {/* 5: Banking */}
          <button
            onClick={() => onNavigate('transactions')}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60"
          >
            <Landmark className="w-[22px] h-[22px] text-[#7C21A4] stroke-[2.2]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              Banking
            </span>
          </button>

          {/* 6: Government Services */}
          <button
            onClick={onOpenGovernmentServices}
            className="h-[64px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[14px] px-3 flex flex-col items-center justify-center gap-1 shadow-2xs border border-neutral-200/60 text-center"
          >
            <Building2 className="w-[22px] h-[22px] text-[#7C21A4] stroke-[2.2]" />
            <span className="text-[12px] font-medium text-neutral-900 leading-none">
              Government Services
            </span>
          </button>
        </div>
      </div>

      {/* Floating Centered "Scan QR" Pill: 40px high with scan-frame icon */}
      <div className="absolute bottom-[66px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={onOpenScanQr}
          className="h-10 px-5 rounded-full bg-[#7C21A4] hover:bg-[#68198a] active:scale-95 text-white font-bold text-[13px] flex items-center gap-2 shadow-lg shadow-purple-900/30 transition border border-white/20"
        >
          <ScanLine className="w-4 h-4 stroke-[2.5]" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
