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
  QrCode,
} from 'lucide-react';
import { BankCard } from './BankCard.tsx';
import { ScreenType } from '../types/index.ts';

interface HomeScreenProps {
  balance: number;
  isBalanceMasked: boolean;
  onToggleMask: () => void;
  onNavigate: (screen: ScreenType) => void;
  userName: string;
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
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F3EC] select-none">
      {/* CBE Purple Header */}
      <div className="bg-[#7C21A4] px-4.5 pt-2 pb-3 text-white shrink-0">
        <div className="flex items-center justify-between">
          {/* User info */}
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
            title="Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>
            <div>
              <div className="text-[10.5px] text-purple-200 leading-none">Hello,</div>
              <div className="text-[15px] font-bold tracking-tight leading-tight mt-0.5">
                {userName.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1 transition"
            >
              <span>{language}</span>
              <span className="text-[9px]">▾</span>
            </button>

            <button
              onClick={handleRefresh}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              aria-label="Refresh account"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CBE Black Bank Card */}
      <BankCard
        balance={balance}
        isMasked={isBalanceMasked}
        onToggleMask={onToggleMask}
        accountName="Wadiah Ordinary"
        accountNumber="1000562339427"
        lastUpdated="06 Nov 2026 • 10:52 PM"
        onCopyAccount={onCopyAccount}
        copied={copied}
      />

      {/* Scrollable services sheet */}
      <div className="flex-1 bg-[#F5F3EC] rounded-t-[28px] mt-2 px-4 pt-3 pb-24 overflow-y-auto no-scrollbar shadow-inner">
        {/* Handle bar */}
        <div className="w-9 h-1 rounded-full bg-[#d9c8b4] mx-auto mb-3"></div>

        {/* 4 Circular Quick Actions */}
        <div className="flex items-center justify-between px-1 mb-4">
          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1.5 w-16 group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition group-active:scale-95">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 leading-tight text-center">
              Mini Statement
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1.5 w-16 group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition group-active:scale-95">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 leading-tight text-center">
              Cash Out
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="flex flex-col items-center gap-1.5 w-16 group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition group-active:scale-95">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 leading-tight text-center">
              Bill Share
            </span>
          </button>

          <button
            onClick={() => onNavigate('transactions')}
            className="flex flex-col items-center gap-1.5 w-16 group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs group-hover:shadow-md flex items-center justify-center text-[#7C21A4] transition group-active:scale-95">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 leading-tight text-center">
              Cards
            </span>
          </button>

          <button
            onClick={() => onNavigate('transfer')}
            className="w-6 h-6 rounded-full bg-white shadow-2xs flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition"
            aria-label="More quick actions"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 CBE Grid Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1: CBE Transfer */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[92px]"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-0.5">
              <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900 leading-tight">
              CBE Transfer
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">Send Money</span>
          </button>

          {/* Tile 2: Receive */}
          <button
            onClick={onOpenReceiveModal}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[92px]"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-0.5">
              <ArrowDownLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900 leading-tight">
              Receive
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">Get Paid</span>
          </button>

          {/* Tile 3: Airtime */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <Phone className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900">Airtime</span>
          </button>

          {/* Tile 4: Other Transfers */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <ArrowLeftRight className="w-5 h-5 stroke-[2.3]" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900">Other Transfers</span>
          </button>

          {/* Tile 5: CBEBirr */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <Wallet className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900">CBEBirr</span>
          </button>

          {/* Tile 6: Bills & Utilities */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900">Bills &amp; Utilities</span>
          </button>

          {/* Tile 7: Banking */}
          <button
            onClick={() => onNavigate('transactions')}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900">Banking</span>
          </button>

          {/* Tile 8: Government Services */}
          <button
            onClick={onOpenGovernmentServices}
            className="bg-[#EAE6DB] hover:bg-[#e2ddd0] active:scale-[0.98] transition rounded-2xl p-3.5 flex flex-col items-center text-center justify-center gap-1 shadow-2xs min-h-[88px]"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[#7C21A4] mb-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-bold text-neutral-900 leading-tight">
              Government Services
            </span>
          </button>
        </div>
      </div>

      {/* Floating Scan QR Pill */}
      <div className="absolute bottom-[64px] left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onOpenScanQr}
          className="h-9 px-5 rounded-full bg-[#7C21A4] hover:bg-[#68198a] active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/30 transition"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
