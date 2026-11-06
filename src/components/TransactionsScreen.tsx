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
  language,
  onToggleLanguage,
  onCopyAccount,
  copied,
  onOpenSettings,
}) => {
  const [filter, setFilter] = useState<'all' | TxType>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F3EC] select-none">
      {/* Header */}
      <div className="bg-[#7C21A4] px-4.5 pt-2 pb-3 text-white shrink-0">
        <div className="flex items-center justify-between">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
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

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1 transition"
            >
              <span>{language}</span>
              <span className="text-[9px]">▾</span>
            </button>

            <button
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              aria-label="Refresh transactions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-8 h-8 rounded-full ${
                isSearchOpen ? 'bg-white text-[#7C21A4]' : 'bg-white/20 text-white'
              } flex items-center justify-center transition`}
              aria-label="Toggle search transactions"
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

      {/* Transaction List Sheet */}
      <div className="flex-1 bg-[#F5F3EC] rounded-t-[28px] mt-2 px-4 pt-3 pb-24 overflow-y-auto no-scrollbar shadow-inner">
        <div className="w-9 h-1 rounded-full bg-[#d9c8b4] mx-auto mb-3"></div>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-[#ded9cc] pb-2 mb-3">
          <div className="flex items-center gap-6 text-[13px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`relative pb-1.5 transition ${
                filter === 'all' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <span>All</span>
              {filter === 'all' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#7C21A4] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setFilter('debited')}
              className={`relative pb-1.5 transition ${
                filter === 'debited' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <span>Debited</span>
              {filter === 'debited' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#7C21A4] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setFilter('credited')}
              className={`relative pb-1.5 transition ${
                filter === 'credited' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <span>Credited</span>
              {filter === 'credited' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-[#7C21A4] rounded-full"></span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-neutral-500 hover:text-neutral-900 p-1"
            aria-label="Filter search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar if opened */}
        {isSearchOpen && (
          <div className="mb-3 flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-neutral-300 shadow-2xs animate-in fade-in">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, reference ID, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const isCredit = tx.type === 'credited';
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-2xs hover:shadow-xs transition cursor-pointer active:scale-[0.99] border border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isCredit
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-4.5 h-4.5 stroke-[2.2]" />
                    ) : (
                      <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.2]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 leading-tight">
                      {tx.name}
                    </h4>
                    <p className="text-[10.5px] text-neutral-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-[13.5px] font-extrabold font-mono tracking-tight leading-tight ${
                      isCredit ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {isCredit ? '+' : '-'}
                    {formatETB(tx.amount)} ETB
                  </div>
                  <div className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase mt-1">
                    {tx.category}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
