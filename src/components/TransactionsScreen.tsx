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
  language: string;
  onToggleLanguage: () => void;
  onCopyAccount: () => void;
  copied: boolean;
  onOpenSettings: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  balance,
  isBalanceMasked,
  onToggleMask,
  transactions,
  onSelectTransaction,
  userName,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000562339427',
  language,
  onToggleLanguage,
  onCopyAccount,
  copied,
  onOpenSettings,
}) => {
  const [filter, setFilter] = useState<'all' | TxType>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
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
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F3EC] select-none relative w-full">
      {/* Header (same as Home: purple, rounded bottom) */}
      <header className="bg-[#7C21A4] px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-14 text-white shrink-0 rounded-b-[24px]">
        <div className="flex items-center justify-between">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition active:scale-98"
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
              aria-label="Refresh transactions"
            >
              <RefreshCw
                className={`w-4 h-4 stroke-[2.2] ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-8 h-8 rounded-full ${
                isSearchOpen ? 'bg-white text-[#7C21A4]' : 'bg-white/20 text-white'
              } flex items-center justify-center transition active:scale-95`}
              aria-label="Toggle search transactions"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Card overlaps header by about half */}
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

      {/* Transactions Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-24">
        {/* Search input if active */}
        {isSearchOpen && (
          <div className="mb-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient, remark, or amount..."
              className="w-full h-10 pl-9 pr-9 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#7C21A4]"
              autoFocus
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Tabs: All | Debited | Credited with a search icon on right */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2 mb-3 px-1">
          <div className="flex items-center gap-6 text-[13px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`relative py-1 transition ${
                filter === 'all'
                  ? 'text-[#7C21A4] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7C21A4] after:rounded-full'
                  : 'text-neutral-500 font-medium hover:text-neutral-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('debited')}
              className={`relative py-1 transition ${
                filter === 'debited'
                  ? 'text-[#7C21A4] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7C21A4] after:rounded-full'
                  : 'text-neutral-500 font-medium hover:text-neutral-800'
              }`}
            >
              Debited
            </button>
            <button
              onClick={() => setFilter('credited')}
              className={`relative py-1 transition ${
                filter === 'credited'
                  ? 'text-[#7C21A4] font-bold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7C21A4] after:rounded-full'
                  : 'text-neutral-500 font-medium hover:text-neutral-800'
              }`}
            >
              Credited
            </button>
          </div>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 text-neutral-500 hover:text-[#7C21A4] transition active:scale-90"
            aria-label="Search filter"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'credited';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="bg-white rounded-xl p-3 flex items-center justify-between shadow-2xs border border-neutral-200/60 hover:border-[#7C21A4]/30 active:scale-[0.99] transition cursor-pointer"
                >
                  {/* Left: Circle Arrow + Bold Name + Small Date */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-neutral-900 truncate leading-tight">
                        {tx.name}
                      </div>
                      <div className="text-[12px] text-neutral-500 mt-0.5 leading-tight">
                        {tx.date}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount (+5,000.00 ETB or -850.00 ETB) + Small caps category tag */}
                  <div className="text-right shrink-0 ml-2">
                    <div
                      className={`text-[14px] font-bold font-mono leading-tight ${
                        isCredit ? 'text-emerald-600' : 'text-neutral-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatETB(tx.amount)} ETB
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
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
  );
};
