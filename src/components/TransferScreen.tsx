import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Users,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  User,
  CreditCard,
} from 'lucide-react';
import { Recipient } from '../types/index.ts';
import { searchRecipients, formatETB } from '../utils/banking.ts';

interface TransferScreenProps {
  onBack: () => void;
  onInitiateTransfer: (recipient: Recipient, amount: number, remark: string) => void;
  currentBalance: number;
  userName: string;
  accountName?: string;
  accountNumber?: string;
  recipientsList: Recipient[];
  onDeleteRecipient: (accNumber: string) => void;
  isProcessingTransfer: boolean;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({
  onBack,
  onInitiateTransfer,
  currentBalance,
  userName,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000562339427',
  recipientsList,
  onDeleteRecipient,
  isProcessingTransfer,
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [accountInput, setAccountInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [remarkInput, setRemarkInput] = useState<string>('MB transfer');
  const [isEditingRemark, setIsEditingRemark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'beneficiaries'>('recent');
  const [suggestions, setSuggestions] = useState<Recipient[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [isFromBalanceMasked, setIsFromBalanceMasked] = useState<boolean>(true);

  // Masked representation: 1*********9427
  const maskedAcc =
    accountNumber.length > 4
      ? `${accountNumber.charAt(0)}*********${accountNumber.slice(-4)}`
      : accountNumber;

  useEffect(() => {
    if (!accountInput.trim()) {
      setSuggestions([]);
      return;
    }
    const matched = searchRecipients(accountInput, recipientsList);
    setSuggestions(matched);

    const exactMatch = recipientsList.find(
      (r) =>
        r.accountNumber === accountInput.trim() ||
        r.name.toLowerCase() === accountInput.trim().toLowerCase()
    );
    if (exactMatch) {
      setSelectedRecipient(exactMatch);
    }
  }, [accountInput, recipientsList]);

  const handleSelectRecipient = (r: Recipient) => {
    setSelectedRecipient(r);
    setAccountInput(r.accountNumber);
    setSuggestions([]);
    setErrorText('');
  };

  const handleDelete = (e: React.MouseEvent, accNumber: string) => {
    e.stopPropagation();
    onDeleteRecipient(accNumber);
  };

  const handleContinue = () => {
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) {
      setErrorText('Please enter a valid transfer amount');
      return;
    }
    if (amt > currentBalance) {
      setErrorText(`Insufficient balance. Current balance is ETB ${formatETB(currentBalance)}`);
      return;
    }
    if (!selectedRecipient) {
      if (accountInput.trim().length >= 8) {
        const customRec: Recipient = {
          name: 'Beneficiary ' + accountInput.slice(-4),
          accountNumber: accountInput.trim(),
          masked: accountInput.charAt(0) + '*********' + accountInput.slice(-4),
          initials: 'BE',
        };
        onInitiateTransfer(customRec, amt, remarkInput || 'MB transfer');
        return;
      }
      setErrorText('Please enter or select a recipient account');
      return;
    }

    onInitiateTransfer(selectedRecipient, amt, remarkInput || 'MB transfer');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F3EC] overflow-hidden select-none relative w-full">
      {/* 360° Purple Circular Rotating Loader matching IMG_20261106_230128_031.jpg */}
      {isProcessingTransfer && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center select-none">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="w-18 h-18 rounded-full border-[5px] border-purple-200/20"></div>
            <div className="absolute w-18 h-18 rounded-full border-[5px] border-transparent border-t-[#c084fc] border-r-[#7C21A4] animate-spin"></div>
          </div>
        </div>
      )}

      {/* Header with back arrow and title */}
      <header className="bg-[#7C21A4] px-4 pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-3.5 text-white flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[17px] font-bold tracking-tight">CBE Transfer</h2>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-8">
        {/* "From Account" Card with masked balance and eye icon */}
        <div className="bg-[#1e2a38] rounded-[18px] p-4 text-white shadow-sm border border-white/10 mb-3">
          <div className="text-[11px] text-neutral-400 font-medium">From Account</div>
          <div className="text-[14px] font-bold mt-1 tracking-wide flex items-center gap-2">
            <span>{accountName}</span>
            <span className="font-mono text-neutral-200">{maskedAcc}</span>
          </div>
          <div className="text-[12px] text-neutral-300 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Balance:</span>
              {isFromBalanceMasked ? (
                <span className="font-mono font-bold tracking-[3px] text-white">******</span>
              ) : (
                <span className="font-bold text-white font-mono">{formatETB(currentBalance)} ETB</span>
              )}
            </div>
            <button
              onClick={() => setIsFromBalanceMasked(!isFromBalanceMasked)}
              className="p-1 text-neutral-300 hover:text-white transition active:scale-90"
              aria-label={isFromBalanceMasked ? 'Reveal balance' : 'Hide balance'}
            >
              {isFromBalanceMasked ? (
                <EyeOff className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Selected Recipient Name Row (if selected) */}
        {selectedRecipient && (
          <div className="bg-white rounded-xl px-4 py-2.5 mb-2.5 border border-neutral-200/70 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs text-neutral-500 font-medium">Name:</span>
              <span className="text-[13px] font-bold text-[#7C21A4] truncate">
                {selectedRecipient.name}
              </span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {selectedRecipient.accountNumber.slice(-4)}
            </span>
          </div>
        )}

        {/* Search input with bank icon and contacts icon */}
        <div className="relative mb-2.5">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <Building2 className="w-5 h-5 stroke-[2]" />
          </div>
          <input
            type="text"
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            placeholder="Account Number"
            className="w-full h-[52px] pl-11 pr-11 bg-white rounded-xl border border-neutral-200 text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#7C21A4] shadow-2xs font-mono"
          />
          <button
            onClick={() => setActiveTab('beneficiaries')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#7C21A4] transition p-1"
            title="Contacts / Beneficiaries"
          >
            <Users className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="relative mb-2.5">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <CreditCard className="w-5 h-5 stroke-[2]" />
          </div>
          <input
            type="number"
            step="any"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Amount*"
            className="w-full h-[52px] pl-11 pr-4 bg-white rounded-xl border border-neutral-200 text-[14px] font-bold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#7C21A4] shadow-2xs font-mono"
          />
        </div>

        {/* Suggestions Dropdown (if searching) */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-md mb-2.5 overflow-hidden">
            {suggestions.map((rec) => (
              <div
                key={rec.accountNumber}
                onClick={() => handleSelectRecipient(rec)}
                className="p-3 hover:bg-neutral-50 active:bg-neutral-100 flex items-center justify-between border-b border-neutral-100 last:border-0 cursor-pointer"
              >
                <div>
                  <div className="text-[13px] font-bold text-neutral-900">{rec.name}</div>
                  <div className="text-[11px] font-mono text-neutral-500">{rec.accountNumber}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            ))}
          </div>
        )}

        {/* "Add remark" with text "*Default: MB transfer" */}
        <div className="mb-3 px-1">
          {isEditingRemark ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="Enter remark"
                className="flex-1 h-9 px-3 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-[#7C21A4]"
                autoFocus
              />
              <button
                onClick={() => setIsEditingRemark(false)}
                className="text-xs font-bold text-[#7C21A4] px-2 py-1"
              >
                Done
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingRemark(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer hover:text-neutral-900"
            >
              <div className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-500">
                <Plus className="w-2.5 h-2.5" />
              </div>
              <span className="font-medium">Add remark</span>
              <span className="text-[11px] text-neutral-400 italic">
                *{remarkInput ? `"${remarkInput}"` : 'Default: MB transfer'}
              </span>
            </div>
          )}
        </div>

        {errorText && (
          <div className="mb-3 p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
            {errorText}
          </div>
        )}

        {/* Full-width "Continue" button */}
        <button
          onClick={handleContinue}
          disabled={isProcessingTransfer}
          className="w-full h-[48px] rounded-full bg-[#7C21A4] hover:bg-[#6a1b8c] active:scale-[0.99] text-white font-bold text-[15px] shadow-md shadow-purple-900/20 transition flex items-center justify-center mb-5"
        >
          <span>Continue</span>
        </button>

        {/* Tabs: "Recent Transfers | Beneficiaries" */}
        <div className="flex items-center border-b border-neutral-200 mb-3 px-1">
          <button
            onClick={() => setActiveTab('recent')}
            className={`pb-2 mr-6 text-[13px] font-bold transition relative ${
              activeTab === 'recent'
                ? 'text-[#7C21A4] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7C21A4] after:rounded-full'
                : 'text-neutral-500 font-medium hover:text-neutral-800'
            }`}
          >
            Recent Transfers
          </button>
          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`pb-2 text-[13px] font-bold transition relative ${
              activeTab === 'beneficiaries'
                ? 'text-[#7C21A4] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7C21A4] after:rounded-full'
                : 'text-neutral-500 font-medium hover:text-neutral-800'
            }`}
          >
            Beneficiaries
          </button>
        </div>

        {/* Rows: initials avatar, name, masked account, trash icon and chevron */}
        <div className="space-y-2">
          {recipientsList.map((rec) => (
            <div
              key={rec.accountNumber}
              onClick={() => handleSelectRecipient(rec)}
              className="bg-white rounded-xl p-3 flex items-center justify-between shadow-2xs border border-neutral-200/60 hover:border-[#7C21A4]/30 active:scale-[0.99] transition cursor-pointer"
            >
              {/* Initials Avatar + Name + Masked Account */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#ebd5f5] text-[#7C21A4] font-bold text-xs flex items-center justify-center shrink-0 border border-[#7C21A4]/15">
                  {rec.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-neutral-900 truncate leading-tight">
                    {rec.name}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5 leading-tight">
                    {rec.masked}
                  </div>
                </div>
              </div>

              {/* Trash Icon + Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(e, rec.accountNumber)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 active:scale-90 transition rounded-lg"
                  title="Remove beneficiary"
                  aria-label="Remove recipient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
