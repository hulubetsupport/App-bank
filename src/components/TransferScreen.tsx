import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Landmark,
  Wallet,
  QrCode,
  Calculator,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Recipient } from '../types/index.ts';
import { searchRecipients, INITIAL_RECIPIENTS } from '../utils/banking.ts';
import { playChime } from '../utils/audio.ts';

interface TransferScreenProps {
  onBack: () => void;
  onInitiateTransfer: (recipient: Recipient, amount: number, remark: string) => void;
  currentBalance: number;
  userName: string;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({
  onBack,
  onInitiateTransfer,
  currentBalance,
  userName,
}) => {
  const [accountType, setAccountType] = useState<'other' | 'own'>('other');
  const [recipientsList, setRecipientsList] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient>(INITIAL_RECIPIENTS[0]);
  const [accountInput, setAccountInput] = useState<string>(INITIAL_RECIPIENTS[0].accountNumber);
  const [amountInput, setAmountInput] = useState<string>('850');
  const [remarkInput, setRemarkInput] = useState<string>('MB transfer');
  const [isEditingRemark, setIsEditingRemark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'beneficiaries'>('recent');
  const [suggestions, setSuggestions] = useState<Recipient[]>([]);
  const [errorText, setErrorText] = useState<string>('');

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
    playChime('tap');
    setSelectedRecipient(r);
    setAccountInput(r.accountNumber);
    setSuggestions([]);
    setErrorText('');
  };

  const handleDeleteBeneficiary = (e: React.MouseEvent, accNumber: string) => {
    e.stopPropagation();
    playChime('tap');
    setRecipientsList((prev) => prev.filter((r) => r.accountNumber !== accNumber));
  };

  const handleContinue = () => {
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) {
      setErrorText('Please enter a valid transfer amount');
      playChime('error');
      return;
    }
    if (amt > currentBalance) {
      setErrorText(`Insufficient balance. Current balance is ETB ${currentBalance.toFixed(2)}`);
      playChime('error');
      return;
    }
    if (!selectedRecipient) {
      setErrorText('Please choose or enter a valid CBE recipient account');
      playChime('error');
      return;
    }

    playChime('tap');
    onInitiateTransfer(selectedRecipient, amt, remarkInput || 'MB transfer');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F3EC] overflow-hidden">
      {/* Header */}
      <div className="bg-[#7C21A4] px-4.5 pt-3 pb-3 text-white flex items-center gap-3 shrink-0">
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
      <div className="flex-1 bg-white rounded-t-[28px] -mt-1.5 p-4.5 overflow-y-auto no-scrollbar shadow-md">
        {/* Account Switch Tabs */}
        <div className="flex items-center gap-2.5 mb-3">
          <button
            onClick={() => setAccountType('other')}
            className={`flex-1 h-9 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              accountType === 'other'
                ? 'bg-[#7C21A4] text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-600'
            }`}
          >
            <span>Other Account</span>
            {accountType === 'other' && <span>✓</span>}
          </button>

          <button
            onClick={() => setAccountType('own')}
            className={`flex-1 h-9 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              accountType === 'own'
                ? 'bg-[#7C21A4] text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-600'
            }`}
          >
            <span>Own Account</span>
            {accountType === 'own' && <span>✓</span>}
          </button>
        </div>

        {/* From Account Card */}
        <div className="bg-[#1c2833] rounded-2xl p-3.5 text-white flex items-center justify-between mb-3 shadow-sm">
          <div>
            <div className="text-[10.5px] text-neutral-400 font-medium">From Account</div>
            <div className="text-[13px] font-bold mt-0.5 tracking-wide">
              Wadiah Ordinary 1*********9427
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5 font-mono">
              <span>••••••</span>
              <span>👁</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[#dfba6c] text-[11px] font-bold block">▾</span>
            <span className="text-[#dfba6c] text-xs font-bold">Change</span>
          </div>
        </div>

        {/* Receiver Resolved Banner */}
        {selectedRecipient && (
          <div className="bg-[#f8edf9] border border-[#e8cbf0] rounded-xl p-2.5 px-3 flex items-center justify-between mb-3 animate-in fade-in">
            <div>
              <span className="text-[9.5px] font-bold tracking-wider text-neutral-500 uppercase">
                Receiver Name
              </span>
              <h4 className="text-[13px] font-extrabold text-[#7C21A4] leading-tight">
                {selectedRecipient.name}
              </h4>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED</span>
            </div>
          </div>
        )}

        {/* Account Number Input */}
        <div className="relative mb-2.5">
          <div className="h-12 bg-white rounded-xl border border-neutral-300 px-3.5 flex items-center gap-3 shadow-2xs focus-within:border-[#7C21A4]">
            <Landmark className="w-4.5 h-4.5 text-[#7C21A4] shrink-0" />
            <input
              type="text"
              placeholder="Account Number or Name"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="w-full text-xs font-medium text-neutral-800 outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={() => playChime('tap')}
              className="text-[#7C21A4] hover:text-[#581577] p-1 shrink-0"
              title="Scan QR Code"
              aria-label="Scan account QR code"
            >
              <QrCode className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-13 left-0 right-0 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 max-h-48 overflow-y-auto divide-y divide-neutral-100">
              {suggestions.map((item) => (
                <div
                  key={item.accountNumber}
                  onClick={() => handleSelectRecipient(item)}
                  className="p-2.5 px-3.5 hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-neutral-800">{item.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {item.accountNumber}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#7C21A4] uppercase">Select</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="h-12 bg-white rounded-xl border border-neutral-300 px-3.5 flex items-center gap-3 mb-2 shadow-2xs focus-within:border-[#7C21A4]">
          <Wallet className="w-4.5 h-4.5 text-[#7C21A4] shrink-0" />
          <input
            type="number"
            placeholder="Amount*"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="w-full text-xs font-semibold font-mono text-neutral-800 outline-none placeholder:text-neutral-400"
          />
          <Calculator className="w-4.5 h-4.5 text-[#7C21A4] shrink-0" />
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
                <span className="text-[11px] text-neutral-400 italic">
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
        <div className="flex items-center gap-6 border-b border-neutral-200 pb-2 mb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('recent')}
            className={`relative pb-1.5 transition ${
              activeTab === 'recent' ? 'text-[#7C21A4]' : 'text-neutral-400'
            }`}
          >
            <span>Recent Transfers</span>
            {activeTab === 'recent' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#7C21A4]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`relative pb-1.5 transition ${
              activeTab === 'beneficiaries' ? 'text-[#7C21A4]' : 'text-neutral-400'
            }`}
          >
            <span>Beneficiaries</span>
            {activeTab === 'beneficiaries' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#7C21A4]"></span>
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
                  onClick={(e) => handleDeleteBeneficiary(e, rec.accountNumber)}
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
    </div>
  );
};
