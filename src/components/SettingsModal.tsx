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
  Receipt,
  Code2,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Activity,
} from 'lucide-react';
import {
  Recipient,
  Transaction,
  TxType,
  DeveloperSettings,
  ActivityLog,
  AccountProfile,
} from '../types/index.ts';
import { formatETB, createCustomTransaction, formatCardTimestamp } from '../utils/banking.ts';

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
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction, adjustBalance: boolean) => void;
  onDeleteTransaction: (id: string) => void;
  onClearTransactions: () => void;
  developerSettings: DeveloperSettings;
  onUpdateDeveloperSettings: (next: DeveloperSettings) => void;
  secondaryAccount: AccountProfile;
  onUpdateSecondaryAccount: (next: AccountProfile) => void;
  activityLogs: ActivityLog[];
  onResetDefaults: () => void;
}

type SettingsTab = 'account' | 'transactions' | 'developer';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  balance,
  onUpdateBalance,
  accountName = 'Wadiah Ordinary',
  accountNumber = '1000758204567',
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
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onClearTransactions,
  developerSettings,
  onUpdateDeveloperSettings,
  secondaryAccount,
  onUpdateSecondaryAccount,
  activityLogs,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Account Tab state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accNameInput, setAccNameInput] = useState(accountName);
  const [accNumInput, setAccNumInput] = useState(accountNumber);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(balance.toString());

  // PIN change
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [selectedPinLength, setSelectedPinLength] = useState<number>(pinLength);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Beneficiaries
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newBeneficiaryAcc, setNewBeneficiaryAcc] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');

  // Transactions Tab: Add New Transaction state
  const [txType, setTxType] = useState<TxType>('debited');
  const [txName, setTxName] = useState('');
  const [txAccountNumber, setTxAccountNumber] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('ACCOUNT TO ACCOUNT');
  const [txRemark, setTxRemark] = useState('MB Transfer');
  const [txReferenceId, setTxReferenceId] = useState('');
  const [txDate, setTxDate] = useState('');
  const [txAdjustBalance, setTxAdjustBalance] = useState(true);
  const [txError, setTxError] = useState('');
  const [txAddedNotice, setTxAddedNotice] = useState('');
  const [confirmClearTx, setConfirmClearTx] = useState(false);

  // Developer Tab state
  const [secAccName, setSecAccName] = useState(secondaryAccount.accountName);
  const [secAccNum, setSecAccNum] = useState(secondaryAccount.accountNumber);
  const [secAccBal, setSecAccBal] = useState(secondaryAccount.balance.toString());
  const [secSavedNotice, setSecSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

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

    onAddRecipient({ name: cleanName, accountNumber: cleanAcc, masked, initials });
    setNewBeneficiaryName('');
    setNewBeneficiaryAcc('');
    setIsAddingBeneficiary(false);
  };

  const handleAddCustomTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setTxError('');
    const parsedAmt = parseFloat(txAmount);
    if (!txName.trim()) {
      setTxError('Please enter counterparty / recipient name');
      return;
    }
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setTxError('Please enter a valid positive amount');
      return;
    }

    const expectedBalAfter = txAdjustBalance
      ? txType === 'credited'
        ? Number((balance + parsedAmt).toFixed(2))
        : Math.max(0, Number((balance - parsedAmt).toFixed(2)))
      : balance;

    const newTx = createCustomTransaction({
      name: txName.trim(),
      amount: parsedAmt,
      type: txType,
      category: txCategory,
      accountNumber: txAccountNumber.trim() || '1000614289312',
      remark: txRemark.trim() || 'MB Transfer',
      referenceId: txReferenceId.trim() || undefined,
      date: txDate.trim() || undefined,
      balanceAfter: expectedBalAfter,
    });

    onAddTransaction(newTx, txAdjustBalance);
    setTxName('');
    setTxAccountNumber('');
    setTxAmount('');
    setTxReferenceId('');
    setTxDate('');
    setTxAddedNotice(`Added ${txType === 'credited' ? '+' : '-'}${formatETB(parsedAmt)} ETB`);
    setTimeout(() => setTxAddedNotice(''), 2500);
  };

  const handleSaveSecondaryAccount = () => {
    const parsedBal = parseFloat(secAccBal);
    onUpdateSecondaryAccount({
      ...secondaryAccount,
      accountName: secAccName.trim() || 'Wadiah Staff Sa',
      accountNumber: secAccNum.trim() || '1000839412784',
      balance: isNaN(parsedBal) ? secondaryAccount.balance : Math.max(0, parsedBal),
    });
    setSecSavedNotice(true);
    setTimeout(() => setSecSavedNotice(false), 1800);
  };

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold text-[#29212E]">{label}</div>
        <div className="text-[10.5px] text-[#8E8B94] leading-snug">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? 'bg-[#7B1FA2]' : 'bg-[#D6D4DC]'
        }`}
      >
        <span
          className={`block w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[28px] phone:rounded-t-[32px] max-h-[90%] flex flex-col p-5 phone:p-6 pb-7 phone:pb-8 shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        <div className="w-10 phone:w-12 h-1 phone:h-1.5 bg-[#D8D6DD] rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECECEF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-[#7B1FA2] flex items-center justify-center border border-purple-100/60">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16.5px] font-bold text-[#29212E]">
                Settings &amp; Controls
              </h3>
              <p className="text-[10.5px] text-[#8E8B94]">Commercial Bank of Ethiopia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8E8B94] hover:text-[#29212E] p-1.5 rounded-full bg-[#F7F7F9] transition active:scale-90"
            aria-label="Close Settings"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Internal 3-Tab Switcher: Account | Transactions | Developer */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#F4F3F7] p-1 rounded-2xl my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`h-9 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'account'
                ? 'bg-white text-[#7B1FA2] shadow-2xs'
                : 'text-[#8E8B94] hover:text-[#29212E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`h-9 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'transactions'
                ? 'bg-white text-[#7B1FA2] shadow-2xs'
                : 'text-[#8E8B94] hover:text-[#29212E]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transactions</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('developer')}
            className={`h-9 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'developer'
                ? 'bg-white text-[#7B1FA2] shadow-2xs'
                : 'text-[#8E8B94] hover:text-[#29212E]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-3 py-1 pr-1 text-xs no-scrollbar">
          {/* ================= ACCOUNT TAB ================= */}
          {activeTab === 'account' && (
            <>
              {/* Account Holder Full Name */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#8E8B94] uppercase tracking-wider">
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
                      className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-[13.5px] font-bold text-[#29212E] mt-0.5">{userName}</div>
                )}
              </div>

              {/* Account Details & Number */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1">
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
                        className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-0.5">
                    <div className="text-xs text-[#8E8B94] font-medium">{accountName}</div>
                    <div className="text-[13.5px] font-bold text-[#29212E] font-mono tracking-wide tabular-nums">
                      {accountNumber}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Balance + Quick Presets */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-[#7B1FA2]" />
                    <span>Account Balance</span>
                  </span>
                  {!isEditingBalance && (
                    <button
                      onClick={() => {
                        setBalanceInput(balance.toString());
                        setIsEditingBalance(true);
                      }}
                      className="text-xs font-bold text-[#7B1FA2] hover:underline"
                    >
                      Edit Balance
                    </button>
                  )}
                </div>

                {isEditingBalance ? (
                  <div className="space-y-2 mt-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        className="flex-1 h-9 px-3 bg-white border border-[#ECECEF] rounded-xl outline-none font-semibold font-mono text-[#29212E] focus:border-[#7B1FA2]"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveBalance}
                        className="h-9 px-3.5 bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white rounded-xl font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                        <span>Save</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[9791.01, 25000, 100000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBalanceInput(preset.toString())}
                          className="px-2.5 py-1 rounded-full bg-white border border-[#ECECEF] text-[10.5px] font-bold text-[#7B1FA2] hover:bg-purple-50"
                        >
                          {formatETB(preset)} ETB
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[13.5px] font-bold text-[#29212E] font-mono mt-0.5 tabular-nums">
                    {formatETB(balance)} <span className="font-sans">ETB</span>
                  </div>
                )}
              </div>

              {/* Security PIN */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1">
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
                      <span className="text-[11px] text-[#8E8B94] font-medium">PIN Format:</span>
                      {[4, 6].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setSelectedPinLength(len)}
                          className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition ${
                            selectedPinLength === len
                              ? 'bg-[#7B1FA2] text-white'
                              : 'bg-[#F7F7F9] text-[#8E8B94]'
                          }`}
                        >
                          {len} Digits
                        </button>
                      ))}
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
                        type="button"
                        onClick={() => setIsChangingPin(false)}
                        className="flex-1 h-8 rounded-lg bg-[#ECECEF] text-[#29212E] text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePin}
                        className="flex-1 h-8 rounded-lg bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white text-xs font-bold"
                      >
                        Update PIN
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#8E8B94] font-medium mt-0.5 flex items-center gap-1.5">
                    <span>••••••</span>
                    <span className="text-[10px] text-[#8E8B94]">(PIN protected)</span>
                  </div>
                )}
              </div>

              {/* Saved Beneficiary Accounts */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1">
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
                        type="button"
                        onClick={() => setIsAddingBeneficiary(false)}
                        className="flex-1 h-7.5 rounded-lg bg-[#ECECEF] text-[#29212E] text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveBeneficiary}
                        className="flex-1 h-7.5 rounded-lg bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] text-white text-xs font-bold"
                      >
                        Save Account
                      </button>
                    </div>
                  </div>
                )}

                <div className="max-h-36 overflow-y-auto divide-y divide-[#ECECEF] pr-1">
                  {recipientsList.map((rec) => (
                    <div key={rec.accountNumber} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#29212E] text-[12.5px]">{rec.name}</div>
                        <div className="text-[10.5px] text-[#8E8B94] font-mono">{rec.accountNumber}</div>
                      </div>
                      <button
                        onClick={() => onDeleteRecipient(rec.accountNumber)}
                        className="p-1 text-[#8E8B94] hover:text-[#E65C57] transition"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language */}
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

              {/* Sign Out */}
              <div className="pt-1">
                <button
                  onClick={onLogout}
                  className="w-full h-11 rounded-full bg-[#FCE8E7] hover:bg-[#F9D7D6] active:scale-[0.99] text-[#E65C57] font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out &amp; Lock App</span>
                </button>
              </div>
            </>
          )}

          {/* ================= TRANSACTIONS TAB ================= */}
          {activeTab === 'transactions' && (
            <>
              {/* Add New Transaction Card */}
              <form
                onSubmit={handleAddCustomTransaction}
                className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>Add New Transaction</span>
                  </span>
                  {txAddedNotice && (
                    <span className="text-[10.5px] font-bold text-[#159B75] bg-[#EBF6EE] px-2 py-0.5 rounded-full">
                      {txAddedNotice}
                    </span>
                  )}
                </div>

                {/* Debited vs Credited selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('debited')}
                    className={`h-8.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      txType === 'debited'
                        ? 'bg-[#FCE8E7] text-[#C64545] border border-[#E65C57]/40'
                        : 'bg-white text-[#8E8B94] border border-[#ECECEF]'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Debited (-)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('credited')}
                    className={`h-8.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      txType === 'credited'
                        ? 'bg-[#EBF6EE] text-[#159B75] border border-[#159B75]/40'
                        : 'bg-white text-[#8E8B94] border border-[#ECECEF]'
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Credited (+)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name (e.g. Dawit Bekele)"
                    value={txName}
                    onChange={(e) => setTxName(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Amount (ETB)"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono font-bold text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Account / Phone"
                    value={txAccountNumber}
                    onChange={(e) => setTxAccountNumber(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  />
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="h-9 px-2.5 bg-white border border-[#ECECEF] rounded-xl text-[11px] font-semibold text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  >
                    <option value="ACCOUNT TO ACCOUNT">ACCOUNT TO ACCOUNT</option>
                    <option value="TRANSFER TO TELEBIRR">TRANSFER TO TELEBIRR</option>
                    <option value="CBE BIRR TRANSFER">CBE BIRR TRANSFER</option>
                    <option value="TOP-UP (AIRTIME & DATA RECHARGE)">AIRTIME &amp; DATA</option>
                    <option value="MERCHANT PAYMENT">MERCHANT PAYMENT</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Remark (MB Transfer)"
                    value={txRemark}
                    onChange={(e) => setTxRemark(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  />
                  <input
                    type="text"
                    placeholder="Ref ID (Auto if blank)"
                    value={txReferenceId}
                    onChange={(e) => setTxReferenceId(e.target.value)}
                    className="h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Date & Time (Optional, e.g. 06-Nov-26 10:54 PM)"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                />

                <label className="flex items-center gap-2 text-[11.5px] text-[#29212E] font-medium cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={txAdjustBalance}
                    onChange={(e) => setTxAdjustBalance(e.target.checked)}
                    className="w-4 h-4 accent-[#7B1FA2] rounded"
                  />
                  <span>Adjust current account balance automatically</span>
                </label>

                {txError && (
                  <p className="text-[11px] font-semibold text-[#E65C57]">{txError}</p>
                )}

                <button
                  type="submit"
                  className="w-full h-10 rounded-full bg-gradient-to-r from-[#76169B] to-[#8D24AA] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
                </button>
              </form>

              {/* Existing Transactions Removal List */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase tracking-wider">
                    Manage Transactions ({transactions.length})
                  </span>
                  {transactions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirmClearTx) {
                          setConfirmClearTx(true);
                          setTimeout(() => setConfirmClearTx(false), 3000);
                        } else {
                          onClearTransactions();
                          setConfirmClearTx(false);
                        }
                      }}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition ${
                        confirmClearTx
                          ? 'bg-[#E65C57] text-white'
                          : 'text-[#E65C57] hover:bg-red-50'
                      }`}
                    >
                      {confirmClearTx ? 'Confirm Clear All?' : 'Clear All'}
                    </button>
                  )}
                </div>

                {transactions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#8E8B94]">
                    No stored transactions. Add one above.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#ECECEF] pr-1">
                    {transactions.map((tx) => {
                      const isCredit = tx.type === 'credited';
                      return (
                        <div key={tx.id} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                isCredit
                                  ? 'bg-[#EBF6EE] text-[#159B75]'
                                  : 'bg-[#FCE8E7] text-[#E65C57]'
                              }`}
                            >
                              {isCredit ? (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[12.5px] font-bold text-[#29212E] truncate">
                                {tx.name}
                              </div>
                              <div className="text-[10.5px] text-[#8E8B94] tabular-nums">
                                {tx.date} • {tx.referenceId}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-xs font-bold tabular-nums ${
                                isCredit ? 'text-[#159B75]' : 'text-[#C64545]'
                              }`}
                            >
                              {isCredit ? '+' : '-'}
                              {formatETB(tx.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onDeleteTransaction(tx.id)}
                              className="p-1.5 rounded-lg text-[#8E8B94] hover:text-[#E65C57] hover:bg-red-50 transition"
                              title="Remove transaction"
                              aria-label={`Remove transaction ${tx.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= DEVELOPER TAB ================= */}
          {activeTab === 'developer' && (
            <>
              {/* Feature & UI Behavior Toggles */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF] divide-y divide-[#ECECEF]">
                <div className="pb-2">
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>Developer Runtime Controls</span>
                  </span>
                </div>

                <ToggleSwitch
                  checked={developerSettings.defaultBalanceMasked}
                  onChange={(val) =>
                    onUpdateDeveloperSettings({ ...developerSettings, defaultBalanceMasked: val })
                  }
                  label="Mask Balance by Default (******)"
                  description="Starts Home & Transactions cards hidden until tapped."
                />

                <ToggleSwitch
                  checked={developerSettings.applyStandardFees}
                  onChange={(val) =>
                    onUpdateDeveloperSettings({ ...developerSettings, applyStandardFees: val })
                  }
                  label="Apply Standard CBE Fee Tier"
                  description="Adds Service Charge, VAT (15%) & Disaster Recovery (5%) on transfers."
                />

                <ToggleSwitch
                  checked={developerSettings.biometricsEnabled}
                  onChange={(val) =>
                    onUpdateDeveloperSettings({ ...developerSettings, biometricsEnabled: val })
                  }
                  label="Biometrics Sign-In Button"
                  description="Shows/hides the Fingerprint quick auth button on Login."
                />

                <ToggleSwitch
                  checked={developerSettings.showCardWorldMap}
                  onChange={(val) =>
                    onUpdateDeveloperSettings({ ...developerSettings, showCardWorldMap: val })
                  }
                  label="Card Dotted World-Map Overlay"
                  description="Displays dotted global map background texture on Bank Card."
                />

                <ToggleSwitch
                  checked={developerSettings.autoLiveTimestamp}
                  onChange={(val) =>
                    onUpdateDeveloperSettings({ ...developerSettings, autoLiveTimestamp: val })
                  }
                  label="Live Auto-Updating Card Timestamp"
                  description="Uses current device time instead of static timestamp string."
                />
              </div>

              {/* Card Timestamp & Transfer Loader Speed */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF] space-y-3">
                {!developerSettings.autoLiveTimestamp && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase">
                        Custom Card Timestamp
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateDeveloperSettings({
                            ...developerSettings,
                            cardLastUpdated: formatCardTimestamp(),
                          })
                        }
                        className="text-[10.5px] font-bold text-[#7B1FA2] hover:underline"
                      >
                        Set Now
                      </button>
                    </div>
                    <input
                      type="text"
                      value={developerSettings.cardLastUpdated}
                      onChange={(e) =>
                        onUpdateDeveloperSettings({
                          ...developerSettings,
                          cardLastUpdated: e.target.value,
                        })
                      }
                      className="w-full h-9 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
                    />
                  </div>
                )}

                <div>
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase block mb-1.5">
                    Transfer Processing Delay ({developerSettings.transferDelayMs}ms)
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: '0ms', ms: 0 },
                      { label: '800ms', ms: 800 },
                      { label: '1.8s', ms: 1800 },
                      { label: '3.0s', ms: 3000 },
                    ].map((opt) => (
                      <button
                        key={opt.ms}
                        type="button"
                        onClick={() =>
                          onUpdateDeveloperSettings({
                            ...developerSettings,
                            transferDelayMs: opt.ms,
                          })
                        }
                        className={`h-8 rounded-xl text-[11px] font-bold transition ${
                          developerSettings.transferDelayMs === opt.ms
                            ? 'bg-[#7B1FA2] text-white'
                            : 'bg-white border border-[#ECECEF] text-[#29212E]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Account Card Configuration */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase tracking-wider">
                    Secondary Account (Card 2 / Own Account)
                  </span>
                  {secSavedNotice && (
                    <span className="text-[10.5px] font-bold text-[#159B75]">Saved</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={secAccName}
                    onChange={(e) => setSecAccName(e.target.value)}
                    placeholder="Account Type"
                    className="h-8.5 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={secAccNum}
                    onChange={(e) => setSecAccNum(e.target.value)}
                    placeholder="Account Number"
                    className="h-8.5 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={secAccBal}
                    onChange={(e) => setSecAccBal(e.target.value)}
                    placeholder="Balance (ETB)"
                    className="flex-1 h-8.5 px-3 bg-white border border-[#ECECEF] rounded-xl text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSecondaryAccount}
                    className="h-8.5 px-4 rounded-xl bg-[#7B1FA2] text-white text-xs font-bold"
                  >
                    Save Card 2
                  </button>
                </div>
              </div>

              {/* Activity & Audit Logs */}
              <div className="p-3.5 rounded-[18px] bg-[#F7F7F9] border border-[#ECECEF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-[#8E8B94] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#7B1FA2]" />
                    <span>System Activity Logs ({activityLogs.length})</span>
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-3 text-[11px] text-[#8E8B94]">
                      No recorded events yet
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2 bg-white rounded-xl border border-[#ECECEF] text-[10.5px]"
                      >
                        <div className="flex items-center justify-between font-bold text-[#29212E]">
                          <span>{log.action}</span>
                          <span className="text-[#159B75]">{log.category}</span>
                        </div>
                        <div className="text-[#6E6A73] truncate">{log.details}</div>
                        <div className="text-[9.5px] text-[#96939A] font-mono mt-0.5">
                          {log.timestamp}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Factory Reset */}
              <button
                type="button"
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    setTimeout(() => setConfirmReset(false), 3000);
                  } else {
                    onResetDefaults();
                    setConfirmReset(false);
                  }
                }}
                className={`w-full h-10 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition ${
                  confirmReset
                    ? 'bg-[#E65C57] text-white'
                    : 'bg-[#FCE8E7] text-[#E65C57] hover:bg-[#F9D7D6]'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {confirmReset ? 'Tap Again to Confirm Factory Reset' : 'Reset App Data to Defaults'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
