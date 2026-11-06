import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Landmark,
  Wallet,
  Calculator,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
  User,
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
      // If user typed an account number not in saved list, create a transient recipient
      if (accountInput.trim().length >= 8) {
        const customRec: Recipient = {
          name: 'Recipient ' + accountInput.slice(-4),
          accountNumber: accountInput.trim(),
          masked: accountInput.charAt(0) + '*********' + accountInput.slice(-4),
          initials: 'RC',
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
    <div className="flex-1 flex flex-col bg-[#F5F3EC] overflow-hidden select-none relative">
      {/* Header */}
      <div className="bg-[#7C21A4] px-4.5 pt-2 pb-3 text-white flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <h2 className="text-base font-bold tracking-tight">CBE Transfer</h2>
      </div>

      {/* Main Sheet */}
      <div className="flex-1 bg-[#F5F3EC] rounded-t-[28px] -mt-1.5 p-4.5 overflow-y-auto no-scrollbar shadow-inner">
        {/* From Account Card */}
        <div className="bg-[#1c2833] rounded-2xl p-3.5 text-white flex items-center justify-between mb-3 shadow-sm">
          <div>
            <div className="text-[10.5px] text-neutral-400 font-medium">From Account</div>
            <div className="text-[13px] font-bold mt-0.5 tracking-wide">
              {accountName}{' '}
              <span className="font-mono">
                {isFromBalanceMasked
                  ? accountNumber.length > 4
                    ? `${accountNumber.charAt(0)}*********${accountNumber.slice(-4)}`
                    : accountNumber
                  : accountNumber}
              </span>
            </div>
            {/* Real balance with SVG eye toggle (no emojis!) */}
            <div className="text-[11px] text-neutral-300 mt-1 flex items-center gap-2">
              <span className="font-mono font-bold">
                {isFromBalanceMasked ? '••••••' : `${formatETB(currentBalance)} ETB`}
              </span>
              <button
                onClick={() => setIsFromBalanceMasked(!isFromBalanceMasked)}
                className="text-neutral-400 hover:text-white p-0.5 transition"
                aria-label={isFromBalanceMasked ? 'Reveal balance & account' : 'Hide balance & account'}
              >
                {isFromBalanceMasked ? (
                  <EyeOff className="w-3.5 h-3.5 stroke-[2.2]" />
                ) : (
                  <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Receiver Name Row */}
        {selectedRecipient && (
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 px-1 mb-2">
            <span className="text-neutral-400 font-normal">Name</span>
            <span className="text-neutral-900">{selectedRecipient.name}</span>
          </div>
        )}

        {/* Account Number Input */}
        <div className="relative mb-2.5">
          <div className="h-12 bg-white rounded-xl border border-neutral-300 px-3.5 flex items-center gap-3 shadow-2xs focus-within:border-[#7C21A4]">
            <Landmark className="w-4.5 h-4.5 text-neutral-500 shrink-0" />
            <input
              type="text"
              placeholder="Account Number"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="w-full text-xs font-semibold text-neutral-800 outline-none placeholder:text-neutral-400 font-mono"
            />
            <button
              onClick={() => {
                if (recipientsList.length > 0) handleSelectRecipient(recipientsList[0]);
              }}
              className="text-neutral-400 hover:text-neutral-700 p-1 shrink-0"
              title="Select beneficiary"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown matching IMG_20261106_230128_179_3a591c87.jpg */}
          {suggestions.length > 0 && (
            <div className="absolute top-13 left-0 right-0 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 max-h-48 overflow-y-auto divide-y divide-neutral-100">
              {suggestions.map((item) => (
                <div
                  key={item.accountNumber}
                  onClick={() => handleSelectRecipient(item)}
                  className="p-2.5 px-3.5 hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-[#7C21A4] flex items-center justify-center text-[10px] font-bold">
                      <Landmark className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-800">{item.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {item.accountNumber}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="h-12 bg-white rounded-xl border border-neutral-300 px-3.5 flex items-center gap-3 mb-2 shadow-2xs focus-within:border-[#7C21A4]">
          <Wallet className="w-4.5 h-4.5 text-neutral-500 shrink-0" />
          <input
            type="number"
            placeholder="Amount*"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="w-full text-xs font-semibold font-mono text-neutral-800 outline-none placeholder:text-neutral-400"
          />
          <Calculator className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
        </div>

        {/* Add Remark */}
        <div className="my-2 text-xs text-neutral-600 flex items-center gap-2">
          {isEditingRemark ? (
            <input
              type="text"
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              placeholder="Add remark"
              className="w-full h-8 px-2 text-xs border border-neutral-300 rounded-md outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingRemark(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900"
            >
              <div className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-600">
                <Plus className="w-3 h-3" />
              </div>
              <span>
                Add remark{' '}
                <span className="text-[11px] text-neutral-400">
                  *Default: {remarkInput || 'MB transfer'}
                </span>
              </span>
            </button>
          )}
        </div>

        {errorText && (
          <div className="p-2 mb-2 bg-red-50 text-red-600 text-xs rounded-lg font-medium border border-red-200">
            {errorText}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full h-11 rounded-full bg-[#7C21A4] hover:bg-[#68198a] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-purple-900/20 transition mt-2 mb-4"
        >
          Continue
        </button>

        {/* Tabs: Recent Transfers / Beneficiaries */}
        <div className="flex items-center gap-8 border-b border-neutral-200 pb-2 mb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('recent')}
            className={`relative pb-1.5 transition ${
              activeTab === 'recent' ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            <span>Recent Transfers</span>
            {activeTab === 'recent' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#7C21A4]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`relative pb-1.5 transition ${
              activeTab === 'beneficiaries' ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            <span>Beneficiaries</span>
            {activeTab === 'beneficiaries' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#7C21A4]"></span>
            )}
          </button>
        </div>

        {/* Beneficiaries List */}
        <div className="divide-y divide-neutral-100">
          {recipientsList.map((rec) => (
            <div
              key={rec.accountNumber}
              onClick={() => handleSelectRecipient(rec)}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 px-1 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f2e6f7] text-[#7C21A4] font-bold text-xs flex items-center justify-center shrink-0">
                  {rec.initials}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-800 leading-tight">
                    {rec.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {rec.masked}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <button
                  onClick={(e) => handleDelete(e, rec.accountNumber)}
                  className="p-1 hover:text-red-500 transition"
                  title="Remove Beneficiary"
                  aria-label={`Remove beneficiary ${rec.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360° Circular Rotating Purple Loader Overlay matching IMG_20261106_230128_031_6cb96595.jpg */}
      {isProcessingTransfer && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-20 h-20 rounded-full border-4 border-white/30 border-t-[#7C21A4] border-r-[#9b34cb] animate-spin"></div>
        </div>
      )}
    </div>
  );
};
