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
    <div className="flex-1 flex flex-col bg-[#F7F7F9] overflow-hidden select-none relative w-full h-full">
      {/* 360° Purple Circular Rotating Loader during payment processing */}
      {isProcessingTransfer && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center select-none">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="w-18 h-18 rounded-full border-[5px] border-purple-200/20"></div>
            <div className="absolute w-18 h-18 rounded-full border-[5px] border-transparent border-t-[#8D24AA] border-r-[#7B1FA2] animate-spin"></div>
          </div>
        </div>
      )}

      {/* Header with back arrow and title */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3.5 phone:pb-4.5 text-white flex items-center gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 max-w-[500px] mx-auto w-full">
          <button
            onClick={onBack}
            className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition shadow-2xs"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[17px] phone:text-[19px] font-bold tracking-tight">CBE Transfer</h2>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 phone:px-5.5 pt-3 pb-8 max-w-[500px] mx-auto w-full">
        {/* "From Account" Card with masked balance and eye icon */}
        <div className="bg-gradient-to-br from-[#171717] via-[#202020] to-[#263343] rounded-[22px] phone:rounded-[26px] p-4 phone:p-5.5 text-[#E8D184] shadow-sm border border-white/10 mb-3 phone:mb-4">
          <div className="text-[11px] phone:text-[12px] text-neutral-400 font-medium">From Account</div>
          <div className="text-[14px] phone:text-[16px] font-bold mt-1 tracking-wide flex items-center gap-2">
            <span className="text-white">{accountName}</span>
            <span className="font-mono text-[#E8D184]">{maskedAcc}</span>
          </div>
          <div className="text-[12px] phone:text-[14px] text-neutral-300 mt-2 phone:mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] phone:text-[12px] text-neutral-400">Balance:</span>
              {isFromBalanceMasked ? (
                <span className="font-mono font-bold tracking-[3px] text-white">******</span>
              ) : (
                <span className="font-bold text-white font-mono">{formatETB(currentBalance)} ETB</span>
              )}
            </div>
            <button
              onClick={() => setIsFromBalanceMasked(!isFromBalanceMasked)}
              className="p-1 phone:p-1.5 text-neutral-300 hover:text-white transition active:scale-90"
              aria-label={isFromBalanceMasked ? 'Reveal balance' : 'Hide balance'}
            >
              {isFromBalanceMasked ? (
                <EyeOff className="w-4 h-4 phone:w-5 phone:h-5 stroke-[2.2] text-[#C9B779]" />
              ) : (
                <Eye className="w-4 h-4 phone:w-5 phone:h-5 stroke-[2.2] text-[#C9B779]" />
              )}
            </button>
          </div>
        </div>

        {/* Selected Recipient Name Row (if selected) */}
        {selectedRecipient && (
          <div className="bg-white rounded-[16px] phone:rounded-[18px] px-4 py-2.5 phone:py-3 mb-2.5 border border-[#ECECEF] flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs phone:text-sm text-[#96939A] font-medium">Name:</span>
              <span className="text-[13px] phone:text-[15px] font-bold text-[#7B1FA2] truncate">
                {selectedRecipient.name}
              </span>
            </div>
            <span className="text-xs phone:text-sm text-[#96939A] font-mono">
              {selectedRecipient.accountNumber.slice(-4)}
            </span>
          </div>
        )}

        {/* Account Number Input */}
        <div className="relative mb-2.5 phone:mb-3.5">
          <div className="absolute left-3.5 phone:left-4 top-1/2 -translate-y-1/2 text-[#96939A]">
            <Building2 className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[1.8]" />
          </div>
          <input
            type="text"
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            placeholder="Account Number"
            className="w-full h-[52px] phone:h-[58px] pl-11 phone:pl-12 pr-11 bg-white rounded-[16px] phone:rounded-[20px] border border-[#ECECEF] text-[14px] phone:text-[15.5px] text-[#29212E] placeholder-[#96939A] focus:outline-none focus:border-[#7B1FA2] shadow-2xs font-mono"
          />
          <button
            onClick={() => setActiveTab('beneficiaries')}
            className="absolute right-3.5 phone:right-4 top-1/2 -translate-y-1/2 text-[#96939A] hover:text-[#7B1FA2] transition p-1"
            title="Contacts / Beneficiaries"
          >
            <Users className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[1.8]" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="relative mb-2.5 phone:mb-3.5">
          <div className="absolute left-3.5 phone:left-4 top-1/2 -translate-y-1/2 text-[#96939A]">
            <CreditCard className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[1.8]" />
          </div>
          <input
            type="number"
            step="any"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Amount*"
            className="w-full h-[52px] phone:h-[58px] pl-11 phone:pl-12 pr-4 bg-white rounded-[16px] phone:rounded-[20px] border border-[#ECECEF] text-[14px] phone:text-[16px] font-bold text-[#29212E] placeholder-[#96939A] focus:outline-none focus:border-[#7B1FA2] shadow-2xs font-mono"
          />
        </div>

        {/* Suggestions Dropdown (if searching) */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-[16px] phone:rounded-[20px] border border-[#ECECEF] shadow-md mb-2.5 overflow-hidden">
            {suggestions.map((rec) => (
              <div
                key={rec.accountNumber}
                onClick={() => handleSelectRecipient(rec)}
                className="p-3 phone:p-4 hover:bg-neutral-50 active:bg-neutral-100 flex items-center justify-between border-b border-[#ECECEF] last:border-0 cursor-pointer"
              >
                <div>
                  <div className="text-[13px] phone:text-[14.5px] font-bold text-[#29212E]">{rec.name}</div>
                  <div className="text-[11px] phone:text-[12px] font-mono text-[#96939A]">{rec.accountNumber}</div>
                </div>
                <ChevronRight className="w-4 h-4 phone:w-5 phone:h-5 text-[#96939A]" />
              </div>
            ))}
          </div>
        )}

        {/* "Add remark" with text "*Default: MB transfer" */}
        <div className="mb-3.5 px-1">
          {isEditingRemark ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="Enter remark"
                className="flex-1 h-9 phone:h-10 px-3 bg-white rounded-lg phone:rounded-xl border border-[#ECECEF] text-xs phone:text-sm text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                autoFocus
              />
              <button
                onClick={() => setIsEditingRemark(false)}
                className="text-xs phone:text-sm font-bold text-[#7B1FA2] px-2 py-1"
              >
                Done
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingRemark(true)}
              className="flex items-center gap-1.5 text-xs phone:text-sm text-[#29212E]/80 cursor-pointer hover:text-[#29212E]"
            >
              <div className="w-4 h-4 phone:w-4.5 phone:h-4.5 rounded-full border border-[#96939A] flex items-center justify-center text-[#96939A]">
                <Plus className="w-2.5 h-2.5" />
              </div>
              <span className="font-medium">Add remark</span>
              <span className="text-[11px] phone:text-[12px] text-[#96939A] italic">
                *{remarkInput ? `"${remarkInput}"` : 'Default: MB transfer'}
              </span>
            </div>
          )}
        </div>

        {errorText && (
          <div className="mb-3.5 p-2.5 phone:p-3 bg-red-50 text-[#E65C57] rounded-xl text-xs phone:text-sm font-medium border border-red-200">
            {errorText}
          </div>
        )}

        {/* Full-width "Continue" button */}
        <button
          onClick={handleContinue}
          disabled={isProcessingTransfer}
          className="w-full h-[48px] phone:h-[54px] rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-[0.99] text-white font-bold text-[15px] phone:text-[16.5px] shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition flex items-center justify-center mb-5"
        >
          <span>Continue</span>
        </button>

        {/* Tabs: "Recent Transfers | Beneficiaries" */}
        <div className="flex items-center border-b border-[#ECECEF] mb-3 phone:mb-4 px-1">
          <button
            onClick={() => setActiveTab('recent')}
            className={`pb-2 mr-6 text-[13px] phone:text-[14.5px] font-bold transition relative ${
              activeTab === 'recent'
                ? 'text-[#7B1FA2] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                : 'text-[#96939A] font-medium hover:text-[#29212E]'
            }`}
          >
            Recent Transfers
          </button>
          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`pb-2 text-[13px] phone:text-[14.5px] font-bold transition relative ${
              activeTab === 'beneficiaries'
                ? 'text-[#7B1FA2] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                : 'text-[#96939A] font-medium hover:text-[#29212E]'
            }`}
          >
            Beneficiaries
          </button>
        </div>

        {/* Rows: initials avatar, name, masked account, trash icon and chevron */}
        <div className="space-y-2 phone:space-y-2.5">
          {recipientsList.map((rec) => (
            <div
              key={rec.accountNumber}
              onClick={() => handleSelectRecipient(rec)}
              className="bg-white rounded-[16px] phone:rounded-[20px] p-3 phone:p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#ECECEF] hover:border-[#7B1FA2]/30 active:scale-[0.99] transition cursor-pointer"
            >
              {/* Initials Avatar + Name + Masked Account */}
              <div className="flex items-center gap-3 phone:gap-3.5 min-w-0">
                <div className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#ebd5f5] text-[#7B1FA2] font-bold text-xs phone:text-sm flex items-center justify-center shrink-0 border border-[#7B1FA2]/15">
                  {rec.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] phone:text-[14.5px] font-semibold text-[#29212E] truncate leading-tight">
                    {rec.name}
                  </div>
                  <div className="text-[11px] phone:text-[12px] font-mono text-[#96939A] mt-0.5 leading-tight">
                    {rec.masked}
                  </div>
                </div>
              </div>

              {/* Trash Icon + Chevron */}
              <div className="flex items-center gap-2 phone:gap-2.5 shrink-0">
                <button
                  onClick={(e) => handleDelete(e, rec.accountNumber)}
                  className="p-1.5 text-[#96939A] hover:text-[#E65C57] active:scale-90 transition rounded-lg"
                  title="Remove beneficiary"
                  aria-label="Remove recipient"
                >
                  <Trash2 className="w-4 h-4 phone:w-5 phone:h-5" />
                </button>
                <ChevronRight className="w-4 h-4 phone:w-5 phone:h-5 text-[#96939A]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
