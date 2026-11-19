import React, { useState } from 'react';
import { RefreshCw, Search, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { BankCard } from './BankCard.tsx';
import { Transaction, TxType } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';

interface TransactionsScreenProps {
  balance: number;
  isBalanceMasked: boolean;
  onToggleMask: () => void;
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
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
  onCopyAccount: () => void;
  copied: boolean;
  onOpenSettings: () => void;
  onOpenBalanceModal?: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  balance,
  isBalanceMasked,
  onToggleMask,
  transactions,
  onSelectTransaction,
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
  onCopyAccount,
  copied,
  onOpenSettings,
  onOpenBalanceModal,
}) => {
  const [filter, setFilter] = useState<'all' | TxType>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.name.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q) ||
        tx.referenceId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F9] select-none relative w-full h-full">
      {/* Top Purple Gradient Header */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-5.5 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-28 phone:pb-30 text-white shrink-0">
        <div className="flex items-center justify-between max-w-[500px] mx-auto w-full">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 phone:gap-3 cursor-pointer hover:opacity-90 transition active:scale-98"
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
              aria-label="Refresh transactions"
            >
              <RefreshCw
                className={`w-4 h-4 phone:w-4.5 phone:h-4.5 stroke-[2.2] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-9 h-9 phone:w-10 phone:h-10 rounded-full ${
                isSearchOpen ? 'bg-white text-[#7B1FA2]' : 'bg-white/18 text-white'
              } flex items-center justify-center transition active:scale-95`}
              aria-label="Toggle search transactions"
            >
              <Search className="w-4 h-4 phone:w-4.5 phone:h-4.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Curved White Sheet overlapping Header (overflow-visible so card never clips) */}
      <div className="flex-1 bg-[#F7F7F9] rounded-t-[24px] -mt-8 phone:-mt-9 relative flex flex-col min-h-0">
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

        {/* Transactions Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 phone:px-5 pt-2.5 pb-24 max-w-[500px] mx-auto w-full">
          {isSearchOpen && (
            <div className="mb-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipient, remark, or amount..."
                className="w-full h-10.5 phone:h-11.5 pl-9.5 pr-9 bg-white rounded-xl phone:rounded-2xl border border-[#ECECEF] text-xs phone:text-sm text-[#29212E] placeholder-[#96939A] focus:outline-none focus:border-[#7B1FA2] shadow-2xs"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#96939A] absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-[#96939A] hover:text-[#29212E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Filter Section: All | Debited | Credited */}
          <div className="flex items-center justify-between border-b border-[#ECECEF] pb-2 mb-3 px-1">
            <div className="flex items-center gap-6 phone:gap-8 text-[13.5px] phone:text-[15px]">
              <button
                onClick={() => setFilter('all')}
                className={`relative py-1 transition ${
                  filter === 'all'
                    ? 'text-[#29212E] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                    : 'text-[#8E8B94] font-medium hover:text-[#29212E]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('debited')}
                className={`relative py-1 transition ${
                  filter === 'debited'
                    ? 'text-[#29212E] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                    : 'text-[#8E8B94] font-medium hover:text-[#29212E]'
                }`}
              >
                Debited
              </button>
              <button
                onClick={() => setFilter('credited')}
                className={`relative py-1 transition ${
                  filter === 'credited'
                    ? 'text-[#29212E] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                    : 'text-[#8E8B94] font-medium hover:text-[#29212E]'
                }`}
              >
                Credited
              </button>
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-[#8E8B94] hover:text-[#7B1FA2] transition active:scale-90"
              aria-label="Search filter"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Transaction Cards List */}
          <div className="space-y-2 phone:space-y-2.5">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-[#96939A] text-xs phone:text-sm">
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'credited';

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="bg-white rounded-[16px] phone:rounded-[20px] p-3.5 phone:p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.025)] border border-[#F0EFF4] hover:border-[#7B1FA2]/30 active:scale-[0.99] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 phone:gap-3.5 min-w-0">
                      <div
                        className={`w-9.5 h-9.5 phone:w-10.5 phone:h-10.5 rounded-full flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-[#EBF6EE] text-[#159B75]'
                            : 'bg-[#FCE8E7] text-[#E65C57]'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-5 h-5 stroke-[2.3]" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 stroke-[2.3]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-[13.5px] phone:text-[15px] font-semibold text-[#29212E] truncate leading-tight">
                          {tx.name}
                        </div>
                        <div className="text-[11.5px] phone:text-[12.5px] text-[#8E8B94] mt-0.5 leading-tight tabular-nums">
                          {tx.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div
                        className={`text-[13.5px] phone:text-[15px] font-bold leading-tight tabular-nums ${
                          isCredit ? 'text-[#159B75]' : 'text-[#C64545]'
                        }`}
                      >
                        {isCredit ? '+' : '-'}
                        {formatETB(tx.amount)} ETB
                      </div>
                      <div className="text-[9.5px] phone:text-[10.5px] uppercase tracking-wider font-semibold text-[#8E8B94] mt-0.5">
                        {tx.category}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
