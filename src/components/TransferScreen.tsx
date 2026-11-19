import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Users,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Wallet,
  Calculator,
  QrCode,
  Check,
  X,
} from 'lucide-react';
import { Recipient, AccountProfile } from '../types/index.ts';
import { searchRecipients, formatETB, maskAccountNumber } from '../utils/banking.ts';

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
  onOpenScanQr?: () => void;
  accounts?: AccountProfile[];
  activeAccountIndex?: number;
  onSelectAccountIndex?: (idx: number) => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({
  onBack,
  onInitiateTransfer,
  currentBalance,
  userName,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000758204567',
  recipientsList,
  onDeleteRecipient,
  isProcessingTransfer,
  onOpenScanQr,
  accounts,
  activeAccountIndex = 0,
  onSelectAccountIndex,
}) => {
  const [transferMode, setTransferMode] = useState<'other' | 'own'>('other');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [accountInput, setAccountInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [remarkInput, setRemarkInput] = useState<string>('MB transfer');
  const [isEditingRemark, setIsEditingRemark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'beneficiaries'>('recent');
  const [suggestions, setSuggestions] = useState<Recipient[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [isFromBalanceMasked, setIsFromBalanceMasked] = useState<boolean>(true);
  const [showAccountPicker, setShowAccountPicker] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcExpr, setCalcExpr] = useState<string>('');

  const maskedAcc = maskAccountNumber(accountNumber);

  useEffect(() => {
    if (!accountInput.trim() || transferMode === 'own') {
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
    } else if (
      selectedRecipient &&
      selectedRecipient.accountNumber !== accountInput.trim()
    ) {
      setSelectedRecipient(null);
    }
  }, [accountInput, recipientsList, transferMode]);

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

  const handleCalcPress = (token: string) => {
    if (token === 'C') {
      setCalcExpr('');
      return;
    }
    if (token === '⌫') {
      setCalcExpr((prev) => prev.slice(0, -1));
      return;
    }
    if (token === '=' || token === 'USE') {
      try {
        const sanitized = calcExpr.replace(/[^0-9+\-*/.]/g, '');
        if (!sanitized) return;
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (typeof result === 'number' && isFinite(result) && result >= 0) {
          const rounded = Number(result.toFixed(2)).toString();
          setCalcExpr(rounded);
          setAmountInput(rounded);
          if (token === 'USE') setShowCalculator(false);
        }
      } catch (_) {}
      return;
    }
    setCalcExpr((prev) => prev + token);
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
          masked: maskAccountNumber(accountInput.trim()),
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

  const otherOwnAccounts = (accounts || []).filter((_, idx) => idx !== activeAccountIndex);

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

      {/* Header matching Screenshot_20261105_174855 */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-5.5 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-6 text-white flex items-center gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 max-w-[500px] mx-auto w-full">
          <button
            onClick={onBack}
            className="w-9 h-9 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-[18px] phone:text-[20px] font-bold tracking-tight">CBE Transfer</h2>
        </div>
      </header>

      {/* Curved Sheet overlapping Purple Header */}
      <div className="flex-1 bg-[#F7F7F9] rounded-t-[26px] -mt-3 overflow-y-auto no-scrollbar px-4 phone:px-5 pt-4 pb-24 max-w-[500px] mx-auto w-full relative">
        {/* Top Mode Pills: Other Account ✓ | Own Account */}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <button
            type="button"
            onClick={() => {
              setTransferMode('other');
              setSelectedRecipient(null);
              setAccountInput('');
            }}
            className={`h-11 rounded-full text-[13.5px] phone:text-[14.5px] font-semibold flex items-center justify-center gap-2 transition shadow-2xs ${
              transferMode === 'other'
                ? 'bg-gradient-to-r from-[#76169B] to-[#8E24AA] text-white shadow-[0_4px_12px_rgba(123,31,162,0.28)]'
                : 'bg-white text-[#29212E] border border-[#ECECEF]'
            }`}
          >
            <span>Other Account</span>
            {transferMode === 'other' && (
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#7B1FA2] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTransferMode('own');
              setSuggestions([]);
              if (otherOwnAccounts.length > 0) {
                const target = otherOwnAccounts[0];
                setSelectedRecipient({
                  name: `${userName} (${target.accountName})`,
                  accountNumber: target.accountNumber,
                  masked: maskAccountNumber(target.accountNumber),
                  initials: userName.slice(0, 2).toUpperCase(),
                });
                setAccountInput(target.accountNumber);
              }
            }}
            className={`h-11 rounded-full text-[13.5px] phone:text-[14.5px] font-semibold flex items-center justify-center gap-2 transition shadow-2xs ${
              transferMode === 'own'
                ? 'bg-gradient-to-r from-[#76169B] to-[#8E24AA] text-white shadow-[0_4px_12px_rgba(123,31,162,0.28)]'
                : 'bg-white text-[#29212E] border border-[#ECECEF]'
            }`}
          >
            <span>Own Account</span>
            {transferMode === 'own' && (
              <span className="w-4.5 h-4.5 rounded-full bg-white text-[#7B1FA2] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </button>
        </div>

        {/* "From Account" Dark Card with Change Dropdown */}
        <div className="relative bg-gradient-to-br from-[#1C2126] via-[#222830] to-[#29323C] rounded-[20px] phone:rounded-[24px] p-4 phone:p-5 text-white shadow-sm border border-white/10 mb-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11.5px] phone:text-[12px] text-neutral-300 font-normal">
                From Account
              </div>
              <div className="text-[14px] phone:text-[15.5px] font-semibold mt-1 tracking-wide flex items-center gap-1.5 flex-wrap">
                <span className="text-white">{accountName}</span>
                <span className="text-neutral-400">-</span>
                <span className="font-mono text-white/95 tabular-nums">{maskedAcc}</span>
              </div>
              <div className="text-[13px] phone:text-[14px] text-neutral-200 mt-2 flex items-center gap-2.5">
                {isFromBalanceMasked ? (
                  <span className="font-mono font-bold tracking-[3px] text-white">••••••</span>
                ) : (
                  <span className="font-bold text-white tabular-nums">
                    {formatETB(currentBalance)} ETB
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsFromBalanceMasked(!isFromBalanceMasked)}
                  className="p-0.5 text-neutral-300 hover:text-white transition"
                  aria-label={isFromBalanceMasked ? 'Reveal balance' : 'Hide balance'}
                >
                  {isFromBalanceMasked ? (
                    <EyeOff className="w-4 h-4 stroke-[2]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[2] text-[#E8D184]" />
                  )}
                </button>
              </div>
            </div>

            {accounts && accounts.length > 1 && (
              <button
                type="button"
                onClick={() => setShowAccountPicker(!showAccountPicker)}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition text-[#E8D184] shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
                <span className="text-[11.5px] font-bold mt-0.5">Change</span>
              </button>
            )}
          </div>

          {/* Account Switcher Dropdown */}
          {showAccountPicker && accounts && accounts.length > 1 && (
            <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5 animate-in fade-in">
              {accounts.map((acc, idx) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    onSelectAccountIndex?.(idx);
                    setShowAccountPicker(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition ${
                    idx === activeAccountIndex
                      ? 'bg-[#E8D184]/20 text-[#E8D184] border border-[#E8D184]/40'
                      : 'bg-white/5 text-neutral-200 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold">
                    {acc.accountName} ({maskAccountNumber(acc.accountNumber)})
                  </span>
                  <span className="font-mono font-bold tabular-nums">
                    {isFromBalanceMasked ? '••••••' : `${formatETB(acc.balance)} ETB`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Recipient Banner matching IMG_20261106_230127_613 */}
        {selectedRecipient && (
          <div className="bg-white rounded-[16px] px-4 py-2.5 mb-3 border border-[#ECECEF] flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs phone:text-sm text-[#8E8B94] font-normal shrink-0">
              Name
            </span>
            <span className="h-4 w-[1px] bg-[#ECECEF]" />
            <span className="text-[13.5px] phone:text-[15px] font-bold italic text-[#29212E] truncate flex-1">
              {selectedRecipient.name}
            </span>
          </div>
        )}

        {/* Account Number Input + Autocomplete Overlay */}
        <div className="relative mb-3">
          <div className="relative">
            <div className="absolute left-3.5 phone:left-4 top-1/2 -translate-y-1/2 text-[#7B1FA2]">
              <Building2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <input
              type="text"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="Account Number"
              className="w-full h-[54px] phone:h-[58px] pl-11 phone:pl-12 pr-20 bg-white rounded-[16px] phone:rounded-[18px] border border-[#ECECEF] text-[14px] phone:text-[15.5px] text-[#29212E] placeholder-[#8E8B94] focus:outline-none focus:border-[#7B1FA2] shadow-[0_4px_12px_rgba(0,0,0,0.04)] font-mono"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {onOpenScanQr && (
                <button
                  type="button"
                  onClick={onOpenScanQr}
                  className="p-1.5 text-[#7B1FA2] hover:bg-purple-50 rounded-lg transition"
                  title="Scan QR Code"
                  aria-label="Scan QR Code"
                >
                  <QrCode className="w-4.5 h-4.5 stroke-[2]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('beneficiaries')}
                className="p-1.5 text-[#8E8B94] hover:text-[#7B1FA2] rounded-lg transition"
                title="Contacts / Beneficiaries"
                aria-label="Beneficiaries"
              >
                <Users className="w-4.5 h-4.5 stroke-[1.9]" />
              </button>
            </div>
          </div>

          {/* Floating Autocomplete Dropdown matching IMG_20261106_230128_179 */}
          {suggestions.length > 0 && !selectedRecipient && (
            <div className="absolute left-0 right-0 top-[58px] z-30 bg-white rounded-[18px] border border-[#ECECEF] shadow-[0_14px_30px_rgba(0,0,0,0.12)] max-h-64 overflow-y-auto divide-y divide-[#F0EFF4] animate-in fade-in">
              {suggestions.map((rec) => (
                <div
                  key={rec.accountNumber}
                  onClick={() => handleSelectRecipient(rec)}
                  className="px-3.5 py-3 hover:bg-[#FAF7FC] active:bg-purple-50 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#F3E8F9] text-[#7B1FA2] flex items-center justify-center shrink-0">
                      <Building2 className="w-4.5 h-4.5 stroke-[1.9]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-[#29212E] truncate">
                        {rec.name}
                      </div>
                      <div className="text-[11.5px] font-mono text-[#8E8B94] tabular-nums">
                        {rec.accountNumber}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8B94] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input + Inline Calculator Popover */}
        <div className="relative mb-3">
          <div className="relative">
            <div className="absolute left-3.5 phone:left-4 top-1/2 -translate-y-1/2 text-[#7B1FA2]">
              <Wallet className="w-5 h-5 stroke-[1.8]" />
            </div>
            <input
              type="number"
              step="any"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Amount*"
              className="w-full h-[54px] phone:h-[58px] pl-11 phone:pl-12 pr-12 bg-white rounded-[16px] phone:rounded-[18px] border border-[#ECECEF] text-[14.5px] phone:text-[16px] font-bold text-[#29212E] placeholder-[#8E8B94] focus:outline-none focus:border-[#7B1FA2] shadow-[0_4px_12px_rgba(0,0,0,0.04)] tabular-nums"
            />
            <button
              type="button"
              onClick={() => {
                setCalcExpr(amountInput || '');
                setShowCalculator(!showCalculator);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                showCalculator
                  ? 'bg-purple-100 text-[#7B1FA2]'
                  : 'text-[#7B1FA2] hover:bg-purple-50'
              }`}
              title="Amount Calculator"
              aria-label="Open amount calculator"
            >
              <Calculator className="w-5 h-5 stroke-[1.9]" />
            </button>
          </div>

          {showCalculator && (
            <div className="mt-2 bg-white rounded-2xl border border-[#ECECEF] shadow-xl p-3 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#8E8B94] uppercase tracking-wider">
                  Quick Amount Calculator
                </span>
                <button
                  type="button"
                  onClick={() => setShowCalculator(false)}
                  className="text-[#8E8B94] hover:text-[#29212E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-9 px-3 mb-2 rounded-xl bg-[#F7F7F9] border border-[#ECECEF] flex items-center justify-end font-mono font-bold text-sm text-[#29212E] tabular-nums">
                {calcExpr || '0'}
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '.', '+'].map(
                  (btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleCalcPress(btn)}
                      className={`h-8.5 rounded-lg transition active:scale-95 ${
                        ['/', '*', '-', '+'].includes(btn)
                          ? 'bg-purple-50 text-[#7B1FA2]'
                          : btn === 'C'
                          ? 'bg-red-50 text-[#E65C57]'
                          : 'bg-[#F7F7F9] text-[#29212E] hover:bg-neutral-200'
                      }`}
                    >
                      {btn === '/' ? '÷' : btn === '*' ? '×' : btn}
                    </button>
                  )
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleCalcPress('=')}
                  className="h-8.5 rounded-lg bg-[#ECECEF] text-[#29212E] text-xs font-bold"
                >
                  Calculate (=)
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcPress('USE')}
                  className="h-8.5 rounded-lg bg-[#7B1FA2] text-white text-xs font-bold"
                >
                  Apply Amount
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Remark */}
        <div className="mb-4 px-1">
          {isEditingRemark ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="Enter remark"
                className="flex-1 h-9.5 px-3 bg-white rounded-xl border border-[#ECECEF] text-xs phone:text-sm text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsEditingRemark(false)}
                className="text-xs phone:text-sm font-bold text-[#7B1FA2] px-2 py-1"
              >
                Done
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingRemark(true)}
              className="flex items-center gap-2 text-xs phone:text-sm text-[#29212E] cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md border border-[#7B1FA2] flex items-center justify-center text-[#7B1FA2]">
                <Plus className="w-3.5 h-3.5 stroke-[2.4]" />
              </div>
              <span className="font-medium">Add remark</span>
              <span className="text-[11.5px] text-[#8E8B94] italic">
                *{remarkInput ? `"${remarkInput}"` : 'Default: MB transfer'}
              </span>
            </div>
          )}
        </div>

        {errorText && (
          <div className="mb-3.5 p-3 bg-red-50 text-[#E65C57] rounded-xl text-xs phone:text-sm font-medium border border-red-200">
            {errorText}
          </div>
        )}

        {/* Continue CTA */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isProcessingTransfer}
          className="w-full h-[50px] phone:h-[54px] rounded-full bg-gradient-to-r from-[#76169B] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-[0.99] text-white font-bold text-[15px] phone:text-[16.5px] shadow-[0_6px_18px_rgba(123,31,162,0.3)] transition flex items-center justify-center mb-5"
        >
          <span>Continue</span>
        </button>

        {/* Own Account Quick List OR Recent Transfers / Beneficiaries */}
        {transferMode === 'own' ? (
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#8E8B94] uppercase tracking-wider px-1">
              Your Linked Accounts
            </div>
            {otherOwnAccounts.length === 0 ? (
              <div className="p-4 bg-white rounded-2xl border border-[#ECECEF] text-xs text-[#8E8B94] text-center">
                Add or configure a secondary account in Settings → Developer to transfer between own accounts.
              </div>
            ) : (
              otherOwnAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() =>
                    handleSelectRecipient({
                      name: `${userName} (${acc.accountName})`,
                      accountNumber: acc.accountNumber,
                      masked: maskAccountNumber(acc.accountNumber),
                      initials: userName.slice(0, 2).toUpperCase(),
                    })
                  }
                  className="bg-white rounded-[18px] p-3.5 flex items-center justify-between shadow-2xs border border-[#ECECEF] hover:border-[#7B1FA2]/30 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F3E8F9] text-[#7B1FA2] font-bold text-xs flex items-center justify-center">
                      {acc.accountName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-[#29212E]">
                        {acc.accountName}
                      </div>
                      <div className="text-[11.5px] font-mono text-[#8E8B94]">
                        {maskAccountNumber(acc.accountNumber)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8B94]" />
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 border-b border-[#ECECEF] mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`pb-2.5 text-[13.5px] phone:text-[14.5px] font-bold transition relative text-center ${
                  activeTab === 'recent'
                    ? 'text-[#7B1FA2] after:absolute after:bottom-[-1px] after:left-1/4 after:right-1/4 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                    : 'text-[#8E8B94] font-medium hover:text-[#29212E]'
                }`}
              >
                Recent Transfers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('beneficiaries')}
                className={`pb-2.5 text-[13.5px] phone:text-[14.5px] font-bold transition relative text-center ${
                  activeTab === 'beneficiaries'
                    ? 'text-[#7B1FA2] after:absolute after:bottom-[-1px] after:left-1/4 after:right-1/4 after:h-[2.5px] after:bg-[#7B1FA2] after:rounded-full'
                    : 'text-[#8E8B94] font-medium hover:text-[#29212E]'
                }`}
              >
                Beneficiaries
              </button>
            </div>

            <div className="space-y-2.5">
              {recipientsList.map((rec) => (
                <div
                  key={rec.accountNumber}
                  onClick={() => handleSelectRecipient(rec)}
                  className="bg-white rounded-[18px] p-3.5 phone:p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.025)] border border-[#F0EFF4] hover:border-[#7B1FA2]/30 active:scale-[0.99] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#F3E8F9] text-[#7B1FA2] font-bold text-xs phone:text-sm flex items-center justify-center shrink-0">
                      {rec.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] phone:text-[15px] font-semibold text-[#29212E] truncate leading-tight">
                        {rec.name}
                      </div>
                      <div className="text-[11.5px] phone:text-[12px] font-mono text-[#8E8B94] mt-0.5 leading-tight tabular-nums">
                        {rec.masked}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, rec.accountNumber)}
                      className="p-1.5 text-[#8E8B94] hover:text-[#E65C57] active:scale-90 transition rounded-lg"
                      title="Remove beneficiary"
                      aria-label="Remove recipient"
                    >
                      <Trash2 className="w-4 h-4 phone:w-4.5 phone:h-4.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 phone:w-4.5 phone:h-4.5 text-[#8E8B94]" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
