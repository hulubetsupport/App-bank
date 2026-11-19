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
  Store,
  Plane,
  ShoppingBag,
  Film,
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
  lastUpdated?: string;
  showCardWorldMap?: boolean;
  cardIndex?: number;
  totalCards?: number;
  onSelectCardIndex?: (idx: number) => void;
  language: string;
  onToggleLanguage: () => void;
  onOpenGovernmentServices: () => void;
  onOpenReceiveModal: () => void;
  onOpenScanQr: () => void;
  copied: boolean;
  onCopyAccount: () => void;
  onOpenSettings: () => void;
  onOpenBalanceModal?: () => void;
  onOpenAirtime?: () => void;
  onOpenCbeBirr?: () => void;
  onOpenBankingServices?: () => void;
  onOpenPayMerchant?: () => void;
  onOpenTravel?: () => void;
  onOpenShopping?: () => void;
  onOpenEntertainment?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  isBalanceMasked,
  onToggleMask,
  onNavigate,
  userName,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000758204567',
  lastUpdated = '06 Nov 2026 • 10:52 PM',
  showCardWorldMap = true,
  cardIndex = 0,
  totalCards = 2,
  onSelectCardIndex,
  language,
  onToggleLanguage,
  onOpenGovernmentServices,
  onOpenReceiveModal,
  onOpenScanQr,
  copied,
  onCopyAccount,
  onOpenSettings,
  onOpenBalanceModal,
  onOpenAirtime,
  onOpenCbeBirr,
  onOpenBankingServices,
  onOpenPayMerchant,
  onOpenTravel,
  onOpenShopping,
  onOpenEntertainment,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F9] select-none relative w-full h-full">
      {/* Purple Banking Header behind top portion of the dark card */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-5.5 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-28 phone:pb-30 text-white shrink-0">
        <div className="flex items-center justify-between max-w-[500px] mx-auto w-full">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 phone:gap-3 cursor-pointer hover:opacity-90 active:scale-98 transition"
            title="Account Settings"
          >
            <div className="w-9 h-9 phone:w-10 phone:h-10 rounded-full bg-white/18 flex items-center justify-center shrink-0">
              <div className="grid grid-cols-2 gap-1">
                <span className="w-1.5 h-1.5 rounded-full border border-white"></span>
                <span className="w-1.5 h-1.5 rounded-full border border-white"></span>
                <span className="w-1.5 h-1.5 rounded-full border border-white"></span>
                <span className="w-1.5 h-1.5 rounded-full border border-white"></span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] phone:text-[12px] text-white/85 font-normal">Hello,</div>
              <div className="text-[15.5px] phone:text-[17.5px] font-bold tracking-tight text-white">
                {userName.split(' ')[0]}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 phone:gap-2.5">
            <button
              onClick={onToggleLanguage}
              className="px-3.5 phone:px-4 py-1.5 rounded-full bg-white/18 hover:bg-white/28 active:scale-95 text-white text-[12px] phone:text-[13px] font-medium flex items-center gap-1 transition"
            >
              <span>{language}</span>
              <span className="text-[9px] phone:text-[10px]">▾</span>
            </button>

            <button
              onClick={handleRefresh}
              className="w-9 h-9 phone:w-10 phone:h-10 rounded-full bg-white/18 hover:bg-white/28 active:scale-95 text-white flex items-center justify-center transition"
              aria-label="Refresh account"
            >
              <RefreshCw
                className={`w-4 h-4 phone:w-4.5 phone:h-4.5 stroke-[2.2] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="w-9 h-9 phone:w-10 phone:h-10 rounded-full bg-white/18 hover:bg-white/28 active:scale-95 text-white flex items-center justify-center transition"
              aria-label="Search transactions"
            >
              <Search className="w-4 h-4 phone:w-4.5 phone:h-4.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Curved White Content Surface overlapping Purple Header behind BankCard (overflow-visible so card never clips) */}
      <div className="flex-1 bg-[#F7F7F9] rounded-t-[24px] -mt-8 phone:-mt-9 relative flex flex-col min-h-0">
        {/* BankCard positioned cleanly across the header/sheet seam */}
        <div className="-mt-[68px] phone:-mt-[76px] z-10 shrink-0">
          <BankCard
            balance={balance}
            isMasked={isBalanceMasked}
            onToggleMask={onToggleMask}
            accountName={accountName}
            accountNumber={accountNumber}
            lastUpdated={lastUpdated}
            onCopyAccount={onCopyAccount}
            copied={copied}
            onOpenBalanceModal={onOpenBalanceModal}
            showWorldMap={showCardWorldMap}
            cardIndex={cardIndex}
            totalCards={totalCards}
            onSelectCardIndex={onSelectCardIndex}
          />
        </div>

        {/* Main Scrollable Actions */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 phone:px-5 pt-2.5 pb-24 max-w-[500px] mx-auto w-full">
          {/* Quick Actions Row matching Screenshot_20261105_174848 */}
          <div className="relative flex items-start justify-between px-1 mb-4 phone:mb-5">
            <button
              onClick={() => onNavigate('transfer')}
              className="flex flex-col items-center gap-1.5 w-[72px] phone:w-[82px] group active:scale-95 transition"
            >
              <div className="w-[52px] h-[52px] phone:w-[58px] phone:h-[58px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-[#F0EFF4] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
                <Banknote className="w-5.5 h-5.5 phone:w-6 phone:h-6 stroke-[1.9]" />
              </div>
              <span className="text-[11px] phone:text-[12px] font-semibold text-[#29212E] leading-tight text-center">
                Cash Out
              </span>
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="flex flex-col items-center gap-1.5 w-[72px] phone:w-[82px] group active:scale-95 transition"
            >
              <div className="w-[52px] h-[52px] phone:w-[58px] phone:h-[58px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-[#F0EFF4] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
                <FileText className="w-5.5 h-5.5 phone:w-6 phone:h-6 stroke-[1.9]" />
              </div>
              <span className="text-[11px] phone:text-[12px] font-semibold text-[#29212E] leading-tight text-center">
                Mini Statement
              </span>
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="flex flex-col items-center gap-1.5 w-[72px] phone:w-[82px] group active:scale-95 transition"
            >
              <div className="w-[52px] h-[52px] phone:w-[58px] phone:h-[58px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-[#F0EFF4] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
                <CreditCard className="w-5.5 h-5.5 phone:w-6 phone:h-6 stroke-[1.9]" />
              </div>
              <span className="text-[11px] phone:text-[12px] font-semibold text-[#29212E] leading-tight text-center">
                Cards
              </span>
            </button>

            <button
              onClick={() => onNavigate('transfer')}
              className="flex flex-col items-center gap-1.5 w-[72px] phone:w-[82px] group active:scale-95 transition"
            >
              <div className="w-[52px] h-[52px] phone:w-[58px] phone:h-[58px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-[#F0EFF4] group-hover:shadow-md flex items-center justify-center text-[#7B1FA2] transition">
                <Share2 className="w-5.5 h-5.5 phone:w-6 phone:h-6 stroke-[1.9]" />
              </div>
              <span className="text-[11px] phone:text-[12px] font-semibold text-[#29212E] leading-tight text-center">
                Bill Share
              </span>
            </button>

            <button
              onClick={() => onNavigate('transfer')}
              className="mt-3 w-7 h-7 rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.08)] border border-[#ECECEF] flex items-center justify-center text-[#29212E] hover:text-[#7B1FA2] active:scale-90 transition shrink-0"
              aria-label="More quick actions"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Two-Column Service Grid */}
          <div className="grid grid-cols-2 gap-3 phone:gap-3.5 pb-4">
            {/* CBE Transfer */}
            <button
              onClick={() => onNavigate('transfer')}
              className="h-[66px] phone:h-[76px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3.5 phone:px-4 flex items-center gap-3 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4] text-left"
            >
              <div className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#FCEAEA] flex items-center justify-center text-[#E65C57] shrink-0">
                <ArrowUpRight className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] phone:text-[15px] font-bold text-[#29212E] leading-tight truncate">
                  CBE Transfer
                </div>
                <div className="text-[11px] phone:text-[12px] text-[#8E8B94] font-normal leading-tight mt-0.5">
                  Send Money
                </div>
              </div>
            </button>

            {/* Receive */}
            <button
              onClick={onOpenReceiveModal}
              className="h-[66px] phone:h-[76px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3.5 phone:px-4 flex items-center gap-3 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4] text-left"
            >
              <div className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#4EA46B] shrink-0">
                <ArrowDownLeft className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] phone:text-[15px] font-bold text-[#29212E] leading-tight truncate">
                  Receive
                </div>
                <div className="text-[11px] phone:text-[12px] text-[#8E8B94] font-normal leading-tight mt-0.5">
                  Get Paid
                </div>
              </div>
            </button>

            {/* Airtime */}
            <button
              onClick={onOpenAirtime || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Phone className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Airtime
              </span>
            </button>

            {/* Other Transfers */}
            <button
              onClick={() => onNavigate('transfer')}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <ArrowLeftRight className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Other Transfers
              </span>
            </button>

            {/* CBEBirr */}
            <button
              onClick={onOpenCbeBirr || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Wallet className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                CBEBirr
              </span>
            </button>

            {/* Bills & Utilities */}
            <button
              onClick={() => onNavigate('transfer')}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Receipt className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Bills &amp; Utilities
              </span>
            </button>

            {/* Banking */}
            <button
              onClick={onOpenBankingServices || (() => onNavigate('transactions'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Landmark className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Banking
              </span>
            </button>

            {/* Government Services */}
            <button
              onClick={onOpenGovernmentServices}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4] text-center"
            >
              <Building2 className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Government Services
              </span>
            </button>

            {/* Pay Merchant */}
            <button
              onClick={onOpenPayMerchant || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Store className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Pay Merchant
              </span>
            </button>

            {/* Travel */}
            <button
              onClick={onOpenTravel || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Plane className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Travel
              </span>
            </button>

            {/* Shopping */}
            <button
              onClick={onOpenShopping || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <ShoppingBag className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Shopping
              </span>
            </button>

            {/* Entertainment */}
            <button
              onClick={onOpenEntertainment || (() => onNavigate('transfer'))}
              className="h-[78px] phone:h-[90px] bg-white hover:bg-neutral-50 active:scale-[0.98] transition rounded-[18px] phone:rounded-[20px] px-3 flex flex-col items-center justify-center gap-2 shadow-[0_3px_12px_rgba(0,0,0,0.04)] border border-[#F0EFF4]"
            >
              <Film className="w-6 h-6 phone:w-6.5 phone:h-6.5 text-[#7B1FA2] fill-[#7B1FA2]/15 stroke-[2]" />
              <span className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] leading-none">
                Entertainment
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Centered "Scan QR" Pill */}
      <div className="absolute bottom-[68px] phone:bottom-[76px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <button
          onClick={onOpenScanQr}
          className="h-11 phone:h-12 px-6 phone:px-7 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-95 text-white font-bold text-[13.5px] phone:text-[14.5px] flex items-center gap-2 shadow-[0_8px_20px_rgba(123,31,162,0.38)] transition border border-white/15"
        >
          <ScanLine className="w-4.5 h-4.5 phone:w-5 phone:h-5 stroke-[2.2]" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
