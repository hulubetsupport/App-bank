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
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F9] select-none relative w-full h-full">
      {/* Professional Purple Banking Header with linear gradient */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-12 phone:pb-14 text-white shrink-0 rounded-b-[28px] phone:rounded-b-[34px] shadow-sm">
        <div className="flex items-center justify-between max-w-[500px] mx-auto w-full">
          {/* Left: Application menu icon (grid) + Hello greeting over user's real name */}
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 phone:gap-3 cursor-pointer hover:opacity-90 active:scale-98 transition"
            title="Account Settings"
          >
            <div className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <div className="grid grid-cols-2 gap-0.5 phone:gap-1">
                <span className="w-1.5 h-1.5 phone:w-1.5 phone:h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 phone:w-1.5 phone:h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 phone:w-1.5 phone:h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 phone:w-1.5 phone:h-1.5 rounded-full bg-white"></span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] phone:text-[12px] text-white/80 font-normal">Hello,</div>
              <div className="text-[15px] phone:text-[17px] font-bold tracking-tight text-white">
                {userName.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Right: Language selector pill, refresh button, search button */}
          <div className="flex items-center gap-2 phone:gap-2.5">
            <button
              onClick={onToggleLanguage}
              className="px-3 phone:px-3.5 py-1 phone:py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[12px] phone:text-[13px] font-medium flex items-center gap-1 transition shadow-2xs"
            >
              <span>{language}</span>
              <span className="text-[9px] phone:text-[10px]">▾</span>
            </button>

            <button
              onClick={handleRefresh}
              className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition shadow-2xs"
              aria-label="Refresh account"
            >
              <RefreshCw
                className={`w-4 h-4 phone:w-5 phone:h-5 stroke-[2.2] ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition shadow-2xs"
              aria-label="Search transactions"
            >
              <Search className="w-4 h-4 phone:w-5 phone:h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Redesigned Bank Card positioned with smooth visual overlap */}
      <div className="-mt-10 phone:-mt-12 z-10 shrink-0">
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

      {/* Main Content: Clean White / Neutral #F7F7F9 with Natural Flow */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 phone:px-5.5 pt-2 pb-24 max-w-[500px] mx-auto w-full">
        {/* Subtle decorative handle bar below card */}
        <div className="w-9 phone:w-12 h-1 phone:h-1.5 rounded-full bg-[#E5DFD7] mx-auto mb-3 phone:mb-4 shrink-0"></div>

        {/* Quick Actions Row: 4 circular buttons + chevron right */}
        <div className="flex items-center justify-between px-1 mb-3.5 phone:mb-5">
          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1.5 w-[68px] phone:w-[82px] phone-lg:w-[86px] group active:scale-95 transition"
          >
            <div className="w-[50px] h-[50px] phone:w-[60px] phone:h-[60px] phone-lg:w-[64px] phone-lg:h-[64px] rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.05)] border border-[#ECECEF] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
              <FileText className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] phone:text-[12.5px] font-semibold text-[#29212E] leading-tight text-center">
              Mini Statement
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1.5 w-[68px] phone:w-[82px] phone-lg:w-[86px] group active:scale-95 transition"
          >
            <div className="w-[50px] h-[50px] phone:w-[60px] phone:h-[60px] phone-lg:w-[64px] phone-lg:h-[64px] rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.05)] border border-[#ECECEF] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
              <Banknote className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] phone:text-[12.5px] font-semibold text-[#29212E] leading-tight text-center">
              Cash Out
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1.5 w-[68px] phone:w-[82px] phone-lg:w-[86px] group active:scale-95 transition"
          >
            <div className="w-[50px] h-[50px] phone:w-[60px] phone:h-[60px] phone-lg:w-[64px] phone-lg:h-[64px] rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.05)] border border-[#ECECEF] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
              <Share2 className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] phone:text-[12.5px] font-semibold text-[#29212E] leading-tight text-center">
              Bill Share
            </span>
          </button>

          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1.5 w-[68px] phone:w-[82px] phone-lg:w-[86px] group active:scale-95 transition"
          >
            <div className="w-[50px] h-[50px] phone:w-[60px] phone:h-[60px] phone-lg:w-[64px] phone-lg:h-[64px] rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.05)] border border-[#ECECEF] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
              <CreditCard className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] phone:text-[12.5px] font-semibold text-[#29212E] leading-tight text-center">
              Cards
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="w-7 h-7 phone:w-8.5 phone:h-8.5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] border border-[#ECECEF] flex items-center justify-center text-[#96939A] hover:text-[#29212E] active:scale-90 transition"
            aria-label="More quick actions"
          >
            <ChevronRight className="w-4 h-4 phone:w-5 phone:h-5" />
          </button>
        </div>

        {/* Two-Column Responsive Service Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 phone:gap-3.5 pb-3">
          {/* Row 1 - Left: CBE Transfer / Send Money */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[64px] phone:h-[76px] phone-lg:h-[82px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3.5 phone:px-4.5 flex items-center gap-3 phone:gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF] text-left"
          >
            <div className="w-9 h-9 phone:w-11 phone:h-11 rounded-full bg-[#FCE8E7] flex items-center justify-center text-[#E65C57] shrink-0">
              <ArrowUpRight className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] phone:text-[15px] font-bold text-[#29212E] leading-tight truncate">
                CBE Transfer
              </div>
              <div className="text-[10.5px] phone:text-[12px] text-[#96939A] font-normal leading-tight mt-0.5">
                Send Money
              </div>
            </div>
          </button>

          {/* Row 1 - Right: Receive / Get Paid */}
          <button
            onClick={onOpenReceiveModal}
            className="h-[64px] phone:h-[76px] phone-lg:h-[82px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3.5 phone:px-4.5 flex items-center gap-3 phone:gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF] text-left"
          >
            <div className="w-9 h-9 phone:w-11 phone:h-11 rounded-full bg-[#EBF6EE] flex items-center justify-center text-[#64A878] shrink-0">
              <ArrowDownLeft className="w-5 h-5 phone:w-6 phone:h-6 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] phone:text-[15px] font-bold text-[#29212E] leading-tight truncate">
                Receive
              </div>
              <div className="text-[10.5px] phone:text-[12px] text-[#96939A] font-normal leading-tight mt-0.5">
                Get Paid
              </div>
            </div>
          </button>

          {/* Row 2 - Left: Airtime */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF]"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <Phone className="w-5 h-5 phone:w-6.5 phone:h-6.5 fill-[#7B1FA2]/15 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              Airtime
            </span>
          </button>

          {/* Row 2 - Right: Other Transfers */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF]"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <ArrowLeftRight className="w-5 h-5 phone:w-6.5 phone:h-6.5 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              Other Transfers
            </span>
          </button>

          {/* Row 3 - Left: CBEBirr */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF]"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <Wallet className="w-5 h-5 phone:w-6.5 phone:h-6.5 fill-[#7B1FA2]/15 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              CBEBirr
            </span>
          </button>

          {/* Row 3 - Right: Bills & Utilities */}
          <button
            onClick={() => onNavigate('transfer')}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF]"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <Receipt className="w-5 h-5 phone:w-6.5 phone:h-6.5 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              Bills &amp; Utilities
            </span>
          </button>

          {/* Row 4 - Left: Banking */}
          <button
            onClick={() => onNavigate('transactions')}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF]"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <Landmark className="w-5 h-5 phone:w-6.5 phone:h-6.5 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              Banking
            </span>
          </button>

          {/* Row 4 - Right: Government Services */}
          <button
            onClick={onOpenGovernmentServices}
            className="h-[74px] phone:h-[88px] phone-lg:h-[94px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[22px] px-3 flex flex-col items-center justify-center gap-1.5 phone:gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF] text-center"
          >
            <div className="w-7 h-7 phone:w-9 phone:h-9 flex items-center justify-center text-[#7B1FA2]">
              <Building2 className="w-5 h-5 phone:w-6.5 phone:h-6.5 stroke-[2]" />
            </div>
            <span className="text-[12.5px] phone:text-[14px] phone-lg:text-[14.5px] font-semibold text-[#29212E] leading-none">
              Government Services
            </span>
          </button>
        </div>
      </div>

      {/* Floating Centered "Scan QR" Pill: positioned cleanly above bottom navigation */}
      <div className="absolute bottom-[66px] phone:bottom-[74px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={onOpenScanQr}
          className="h-10 phone:h-12 px-5 phone:px-6.5 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-95 text-white font-bold text-[13px] phone:text-[14.5px] flex items-center gap-2 phone:gap-2.5 shadow-[0_6px_18px_rgba(123,31,162,0.35)] transition border border-white/20"
        >
          <ScanLine className="w-4.5 h-4.5 phone:w-5 phone:h-5 stroke-[2.2]" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
