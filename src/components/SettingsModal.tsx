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
    if (!/^\d+$/.test(newPin)) {
      setPinError('PIN must contain only numbers');
      return;
    }

    onChangePin(newPin, selectedPinLength);
    setPinSuccess(true);
    setOldPin('');
    setNewPin('');
    setTimeout(() => {
      setPinSuccess(false);
      setIsChangingPin(false);
    }, 1200);
  };

  const handleSaveBeneficiary = () => {
    setBeneficiaryError('');
    const cleanName = newBeneficiaryName.trim();
    const cleanAcc = newBeneficiaryAcc.trim();

    if (!cleanName) {
      setBeneficiaryError('Please enter a beneficiary name');
      return;
    }
    if (!cleanAcc || cleanAcc.length < 8) {
      setBeneficiaryError('Account number must be at least 8 digits');
      return;
    }

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
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] max-h-[88%] flex flex-col p-5 phone:p-7 pb-8 phone:pb-10 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#E5DFD7] rounded-full mx-auto mb-3 phone:mb-4"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 phone:pb-4 border-b border-[#ECECEF]">
          <div className="flex items-center gap-2.5 phone:gap-3">
            <div className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-purple-50 text-[#7B1FA2] flex items-center justify-center border border-purple-100/60">
              <User className="w-4.5 h-4.5 phone:w-5 phone:h-5" />
            </div>
            <div>
              <h3 className="text-[14px] phone:text-[16px] font-bold text-[#29212E]">Settings &amp; Accounts</h3>
              <p className="text-[10px] phone:text-[11.5px] text-[#96939A]">Commercial Bank of Ethiopia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#96939A] hover:text-[#29212E] p-1.5 rounded-full transition active:scale-90"
          >
            <X className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2]" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs no-scrollbar">
          {/* 1. Account Holder Full Name (Editable) */}
          <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#96939A] uppercase tracking-wider">
                Account Holder Full Name
              </span>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-bold text-[#7B1FA2] hover:underline"
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
                  className="flex-1 h-9 px-3 bg-white border border-[#ECECEF] rounded-xl outline-none font-semibold text-[#29212E] focus:border-[#7B1FA2]"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1 active:scale-95 transition"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div className="text-[13.5px] font-bold text-[#29212E] mt-0.5">{userName}</div>
            )}
          </div>

          {/* 2. Account Details & Number (Editable) */}
          <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#96939A] uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3 h-3 text-[#7B1FA2]" />
                <span>Account Number &amp; Type</span>
              </span>
              {!isEditingAccount && (
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="text-xs font-bold text-[#7B1FA2] hover:underline"
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
                  className="w-full h-8.5 px-3 bg-white border border-[#ECECEF] rounded-xl outline-none text-xs font-semibold focus:border-[#7B1FA2]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={accNumInput}
                    onChange={(e) => setAccNumInput(e.target.value)}
                    className="flex-1 h-9 px-3 bg-white border border-[#ECECEF] rounded-xl outline-none font-semibold font-mono text-xs text-[#29212E] focus:border-[#7B1FA2]"
                  />
                  <button
                    onClick={handleSaveAccount}
                    className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1 active:scale-95 transition"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-0.5">
                <div className="text-xs text-[#96939A] font-medium">{accountName}</div>
                <div className="text-[13.5px] font-bold text-[#29212E] font-mono tracking-wide">
                  {accountNumber}
                </div>
              </div>
            )}
          </div>

          {/* 3. Account Balance (Editable) */}
          <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#96939A] uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3 h-3 text-[#7B1FA2]" />
                <span>Account Balance</span>
              </span>
              {!isEditingBalance && (
                <button
                  onClick={() => setIsEditingBalance(true)}
                  className="text-xs font-bold text-[#7B1FA2] hover:underline"
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
                  className="flex-1 h-9 px-3 bg-white border border-[#ECECEF] rounded-xl outline-none font-semibold font-mono text-[#29212E] focus:border-[#7B1FA2]"
                  autoFocus
                />
                <button
                  onClick={handleSaveBalance}
                  className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1 active:scale-95 transition"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <div className="text-[13.5px] font-bold text-[#29212E] font-mono mt-0.5">
                {formatETB(balance)} <span className="font-sans">ETB</span>
              </div>
            )}
          </div>

          {/* 4. Security & PIN Change */}
          <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#96939A] uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#7B1FA2]" />
                <span>Security PIN ({pinLength} Digits)</span>
              </span>
              {!isChangingPin && (
                <button
                  onClick={() => setIsChangingPin(true)}
                  className="text-xs font-bold text-[#7B1FA2] hover:underline"
                >
                  Change PIN
                </button>
              )}
            </div>

            {isChangingPin ? (
              <div className="mt-2 space-y-2.5 bg-white p-3 rounded-xl border border-[#ECECEF]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-[#96939A] font-medium">PIN Format:</span>
                  <button
                    onClick={() => setSelectedPinLength(4)}
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition ${
                      selectedPinLength === 4
                        ? 'bg-[#7B1FA2] text-white'
                        : 'bg-[#F7F7F9] text-[#96939A]'
                    }`}
                  >
                    4 Digits
                  </button>
                  <button
                    onClick={() => setSelectedPinLength(6)}
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition ${
                      selectedPinLength === 6
                        ? 'bg-[#7B1FA2] text-white'
                        : 'bg-[#F7F7F9] text-[#96939A]'
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
                  className="w-full h-8.5 px-3 bg-[#F7F7F9] border border-[#ECECEF] rounded-lg outline-none font-mono text-xs focus:border-[#7B1FA2]"
                />

                <input
                  type="password"
                  placeholder={`New ${selectedPinLength}-Digit PIN`}
                  maxLength={selectedPinLength}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full h-8.5 px-3 bg-[#F7F7F9] border border-[#ECECEF] rounded-lg outline-none font-mono text-xs focus:border-[#7B1FA2]"
                />

                {pinError && <p className="text-[10.5px] text-[#E65C57] font-semibold">{pinError}</p>}
                {pinSuccess && (
                  <p className="text-[10.5px] text-[#159B75] font-semibold">
                    PIN updated successfully!
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsChangingPin(false)}
                    className="flex-1 h-8 rounded-lg bg-[#ECECEF] text-[#29212E] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePin}
                    className="flex-1 h-8 rounded-lg bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white text-xs font-bold"
                  >
                    Update PIN
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#96939A] font-medium mt-0.5 flex items-center gap-1.5">
                <span>••••••</span>
                <span className="text-[10px] text-[#96939A]">(PIN protected)</span>
              </div>
            )}
          </div>

          {/* 5. Manage Saved Accounts / Beneficiaries */}
          <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#96939A] uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-[#7B1FA2]" />
                <span>Saved Beneficiary Accounts</span>
              </span>
              <button
                onClick={() => setIsAddingBeneficiary(!isAddingBeneficiary)}
                className="text-xs font-bold text-[#7B1FA2] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Account</span>
              </button>
            </div>

            {isAddingBeneficiary && (
              <div className="p-3 bg-white rounded-xl border border-[#ECECEF] mb-2 space-y-2">
                <input
                  type="text"
                  placeholder="Beneficiary Full Name"
                  value={newBeneficiaryName}
                  onChange={(e) => setNewBeneficiaryName(e.target.value)}
                  className="w-full h-8 px-3 bg-[#F7F7F9] border border-[#ECECEF] rounded-lg outline-none text-xs focus:border-[#7B1FA2]"
                />
                <input
                  type="text"
                  placeholder="Account Number (e.g. 1000...)"
                  value={newBeneficiaryAcc}
                  onChange={(e) => setNewBeneficiaryAcc(e.target.value)}
                  className="w-full h-8 px-3 bg-[#F7F7F9] border border-[#ECECEF] rounded-lg outline-none text-xs font-mono focus:border-[#7B1FA2]"
                />
                {beneficiaryError && (
                  <p className="text-[10.5px] text-[#E65C57] font-semibold">{beneficiaryError}</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsAddingBeneficiary(false)}
                    className="flex-1 h-7.5 rounded-lg bg-[#ECECEF] text-[#29212E] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBeneficiary}
                    className="flex-1 h-7.5 rounded-lg bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white text-xs font-bold"
                  >
                    Save Account
                  </button>
                </div>
              </div>
            )}

            {/* List of saved accounts */}
            <div className="max-h-36 overflow-y-auto divide-y divide-[#ECECEF] pr-1">
              {recipientsList.map((rec) => (
                <div key={rec.accountNumber} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#29212E] text-[12.5px]">{rec.name}</div>
                    <div className="text-[10.5px] text-[#96939A] font-mono">{rec.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => onDeleteRecipient(rec.accountNumber)}
                    className="p-1 text-[#96939A] hover:text-[#E65C57] transition"
                    title="Remove Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Language */}
          <div
            onClick={onToggleLanguage}
            className="p-3.5 rounded-[18px] bg-[#F7F7F9] flex items-center justify-between border border-[#ECECEF] cursor-pointer hover:bg-neutral-100 transition"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7B1FA2]" />
              <span className="font-semibold text-[#29212E] text-xs">App Language</span>
            </div>
            <span className="text-xs font-bold text-[#7B1FA2]">{language} ▾</span>
          </div>

          {/* 7. Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full h-11 rounded-full bg-[#FCE8E7] hover:bg-[#F9D7D6] active:scale-[0.99] text-[#E65C57] font-bold text-xs flex items-center justify-center gap-2 transition"
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
