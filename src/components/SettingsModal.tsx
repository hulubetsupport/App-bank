import React, { useState } from 'react';
import {
  X,
  Lock,
  Globe,
  LogOut,
  User,
  Plus,
  Trash2,
  Wallet,
  Check,
  KeyRound,
  Users,
  Landmark,
} from 'lucide-react';
import { Recipient } from '../types/index.ts';
import { formatETB } from '../utils/banking.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  balance: number;
  onUpdateBalance: (balance: number) => void;
  accountName?: string;
  accountNumber?: string;
  onUpdateAccount?: (name: string, num: string) => void;
  language: string;
  onToggleLanguage: () => void;
  onLogout: () => void;
  correctPin: string;
  onChangePin: (newPin: string, length: number) => void;
  pinLength: number;
  recipientsList: Recipient[];
  onAddRecipient: (rec: Recipient) => void;
  onDeleteRecipient: (accNumber: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  balance,
  onUpdateBalance,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000562339427',
  onUpdateAccount,
  language,
  onToggleLanguage,
  onLogout,
  correctPin,
  onChangePin,
  pinLength,
  recipientsList,
  onAddRecipient,
  onDeleteRecipient,
}) => {
  // Editing profile name
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  // Editing account number & type
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accNameInput, setAccNameInput] = useState(accountName);
  const [accNumInput, setAccNumInput] = useState(accountNumber);

  // Editing balance
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(balance.toString());

  // Changing PIN (4 or 6 digit options, hidden from plain view)
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [selectedPinLength, setSelectedPinLength] = useState<number>(pinLength);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Adding new beneficiary
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newBeneficiaryAcc, setNewBeneficiaryAcc] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleSaveAccount = () => {
    if (accNumInput.trim() && onUpdateAccount) {
      onUpdateAccount(accNameInput.trim() || 'Wadiah Ordinary', accNumInput.trim());
      setIsEditingAccount(false);
    }
  };

  const handleSaveBalance = () => {
    const parsed = parseFloat(balanceInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBalance(parsed);
      setIsEditingBalance(false);
    }
  };

  const handleSavePin = () => {
    setPinError('');
    if (oldPin !== correctPin) {
      setPinError('Current PIN is incorrect');
      return;
    }
    if (newPin.length !== selectedPinLength) {
      setPinError(`New PIN must be exactly ${selectedPinLength} digits`);
      return;
    }
    onChangePin(newPin, selectedPinLength);
    setPinSuccess(true);
    setTimeout(() => {
      setPinSuccess(false);
      setIsChangingPin(false);
      setOldPin('');
      setNewPin('');
    }, 1200);
  };

  const handleSaveBeneficiary = () => {
    setBeneficiaryError('');
    if (!newBeneficiaryName.trim() || !newBeneficiaryAcc.trim()) {
      setBeneficiaryError('Please enter both name and account number');
      return;
    }
    const cleanAcc = newBeneficiaryAcc.trim();
    const cleanName = newBeneficiaryName.trim();
    const initials = cleanName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const masked =
      cleanAcc.length > 4
        ? cleanAcc.charAt(0) + '*********' + cleanAcc.slice(-4)
        : cleanAcc;

    onAddRecipient({
      name: cleanName,
      accountNumber: cleanAcc,
      masked,
      initials,
    });

    setNewBeneficiaryName('');
    setNewBeneficiaryAcc('');
    setIsAddingBeneficiary(false);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] max-h-[88%] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C21A4] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">Settings &amp; Accounts</h3>
              <p className="text-[10px] text-neutral-400">Commercial Bank of Ethiopia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs no-scrollbar">
          {/* 1. Account Holder Full Name (Editable) */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Account Holder Full Name
              </span>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-bold text-[#7C21A4] hover:underline"
                >
                  Edit Name
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 h-8.5 px-3 bg-white border border-neutral-300 rounded-xl outline-none font-semibold text-neutral-800"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="h-8.5 px-3.5 bg-[#7C21A4] text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div className="text-sm font-bold text-neutral-900 mt-0.5">{userName}</div>
            )}
          </div>

          {/* 2. Account Details & Number (Editable) */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3 h-3 text-[#7C21A4]" />
                <span>Account Number &amp; Type</span>
              </span>
              {!isEditingAccount && (
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="text-xs font-bold text-[#7C21A4] hover:underline"
                >
                  Edit Account
                </button>
              )}
            </div>

            {isEditingAccount ? (
              <div className="space-y-2 mt-1.5">
                <input
                  type="text"
                  placeholder="Account Type (e.g. Wadiah Ordinary)"
                  value={accNameInput}
                  onChange={(e) => setAccNameInput(e.target.value)}
                  className="w-full h-8 px-3 bg-white border border-neutral-300 rounded-xl outline-none text-xs font-semibold"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={accNumInput}
                    onChange={(e) => setAccNumInput(e.target.value)}
                    className="flex-1 h-8.5 px-3 bg-white border border-neutral-300 rounded-xl outline-none font-semibold font-mono text-xs text-neutral-800"
                  />
                  <button
                    onClick={handleSaveAccount}
                    className="h-8.5 px-3.5 bg-[#7C21A4] text-white rounded-xl font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-0.5">
                <div className="text-xs text-neutral-500 font-medium">{accountName}</div>
                <div className="text-sm font-bold text-neutral-900 font-mono tracking-wide">
                  {accountNumber}
                </div>
              </div>
            )}
          </div>

          {/* 2. Account Balance (Editable) */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3 h-3 text-[#7C21A4]" />
                <span>Account Balance</span>
              </span>
              {!isEditingBalance && (
                <button
                  onClick={() => setIsEditingBalance(true)}
                  className="text-xs font-bold text-[#7C21A4] hover:underline"
                >
                  Edit Balance
                </button>
              )}
            </div>

            {isEditingBalance ? (
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="number"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  className="flex-1 h-8.5 px-3 bg-white border border-neutral-300 rounded-xl outline-none font-semibold font-mono text-neutral-800"
                  autoFocus
                />
                <button
                  onClick={handleSaveBalance}
                  className="h-8.5 px-3.5 bg-[#7C21A4] text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div className="text-sm font-bold text-neutral-900 font-mono mt-0.5">
                {formatETB(balance)} ETB
              </div>
            )}
          </div>

          {/* 3. Security & PIN Change (Hidden real password with 4 or 6 digit option) */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#7C21A4]" />
                <span>Security PIN ({pinLength} Digits)</span>
              </span>
              {!isChangingPin && (
                <button
                  onClick={() => setIsChangingPin(true)}
                  className="text-xs font-bold text-[#7C21A4] hover:underline"
                >
                  Change PIN
                </button>
              )}
            </div>

            {isChangingPin ? (
              <div className="mt-2 space-y-2 bg-white p-3 rounded-xl border border-neutral-200">
                {/* 4 or 6 digit option toggle */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-neutral-500 font-medium">PIN Format:</span>
                  <button
                    onClick={() => setSelectedPinLength(4)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition ${
                      selectedPinLength === 4
                        ? 'bg-[#7C21A4] text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    4 Digits
                  </button>
                  <button
                    onClick={() => setSelectedPinLength(6)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition ${
                      selectedPinLength === 6
                        ? 'bg-[#7C21A4] text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    6 Digits
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="Current PIN"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  className="w-full h-8 px-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none font-mono text-xs"
                />

                <input
                  type="password"
                  placeholder={`New ${selectedPinLength}-Digit PIN`}
                  maxLength={selectedPinLength}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full h-8 px-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none font-mono text-xs"
                />

                {pinError && <p className="text-[10.5px] text-red-600 font-semibold">{pinError}</p>}
                {pinSuccess && (
                  <p className="text-[10.5px] text-emerald-600 font-semibold">
                    PIN updated successfully!
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsChangingPin(false)}
                    className="flex-1 h-7.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePin}
                    className="flex-1 h-7.5 rounded-lg bg-[#7C21A4] text-white text-xs font-bold"
                  >
                    Update PIN
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center gap-1.5">
                <span>••••••</span>
                <span className="text-[10px] text-neutral-400">(PIN protected)</span>
              </div>
            )}
          </div>

          {/* 4. Manage Saved Accounts / Beneficiaries */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-[#7C21A4]" />
                <span>Saved Beneficiary Accounts</span>
              </span>
              <button
                onClick={() => setIsAddingBeneficiary(!isAddingBeneficiary)}
                className="text-xs font-bold text-[#7C21A4] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Account</span>
              </button>
            </div>

            {/* Add Beneficiary form */}
            {isAddingBeneficiary && (
              <div className="p-3 bg-white rounded-xl border border-neutral-200 mb-2 space-y-2">
                <input
                  type="text"
                  placeholder="Beneficiary Full Name"
                  value={newBeneficiaryName}
                  onChange={(e) => setNewBeneficiaryName(e.target.value)}
                  className="w-full h-8 px-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none text-xs"
                />
                <input
                  type="text"
                  placeholder="Account Number (e.g. 1000...)"
                  value={newBeneficiaryAcc}
                  onChange={(e) => setNewBeneficiaryAcc(e.target.value)}
                  className="w-full h-8 px-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none text-xs font-mono"
                />
                {beneficiaryError && (
                  <p className="text-[10.5px] text-red-600 font-semibold">{beneficiaryError}</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsAddingBeneficiary(false)}
                    className="flex-1 h-7 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBeneficiary}
                    className="flex-1 h-7 rounded-lg bg-[#7C21A4] text-white text-xs font-bold"
                  >
                    Save Account
                  </button>
                </div>
              </div>
            )}

            {/* List of saved accounts */}
            <div className="max-h-36 overflow-y-auto divide-y divide-neutral-200 pr-1">
              {recipientsList.map((rec) => (
                <div key={rec.accountNumber} className="py-1.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-800 text-[12px]">{rec.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{rec.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => onDeleteRecipient(rec.accountNumber)}
                    className="p-1 text-neutral-400 hover:text-red-500"
                    title="Remove Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Language */}
          <div
            onClick={onToggleLanguage}
            className="p-3.5 rounded-2xl bg-neutral-50 flex items-center justify-between border border-neutral-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7C21A4]" />
              <span className="font-semibold text-neutral-800 text-xs">App Language</span>
            </div>
            <span className="text-xs font-bold text-[#7C21A4]">{language} ▾</span>
          </div>

          {/* 6. Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full h-11 rounded-2xl bg-[#faedf0] hover:bg-[#f7dfe4] active:scale-[0.99] text-[#cf3a4b] font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out &amp; Lock App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
