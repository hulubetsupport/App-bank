import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  Transaction,
  Recipient,
  DeveloperSettings,
  AccountProfile,
  ActivityLog,
} from './types/index.ts';
import {
  generateTransactionId,
  generateReceiptId,
  INITIAL_RECIPIENTS,
  DEFAULT_AUTH_PIN,
  DEFAULT_DEVELOPER_SETTINGS,
  calculateCharges,
  createActivityLog,
  formatCardTimestamp,
  formatTransactionDate,
  removeTransactionById,
} from './utils/banking.ts';
import { PhoneFrame } from './components/PhoneFrame.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { TransactionsScreen } from './components/TransactionsScreen.tsx';
import { TransferScreen } from './components/TransferScreen.tsx';
import { ReceiptScreen } from './components/ReceiptScreen.tsx';
import { TransactionDetailModal } from './components/TransactionDetailModal.tsx';
import { ConfirmModal } from './components/ConfirmModal.tsx';
import { PinModal } from './components/PinModal.tsx';
import { GovernmentServicesModal } from './components/GovernmentServicesModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ReceiveModal } from './components/ReceiveModal.tsx';
import { ScanQrModal } from './components/ScanQrModal.tsx';
import { AccountBalanceModal } from './components/AccountBalanceModal.tsx';
import { AirtimeModal } from './components/AirtimeModal.tsx';
import { CbeBirrModal } from './components/CbeBirrModal.tsx';
import { BankingServicesModal } from './components/BankingServicesModal.tsx';
import { PayMerchantModal } from './components/PayMerchantModal.tsx';
import { TravelModal } from './components/TravelModal.tsx';
import { ShoppingModal } from './components/ShoppingModal.tsx';
import { EntertainmentModal } from './components/EntertainmentModal.tsx';
import { Home, Landmark, Settings } from 'lucide-react';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_dawit',
    name: 'Dawit Bekele Tadesse',
    date: '06-Nov-26 10:54 PM',
    timestamp: Date.now() - 120000,
    amount: 5.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26311KH4GH',
    receiptId: 'v2-hfHCxNVvrTgUZ3k1kOTg',
    accountNumber: '1000614289312',
    remark: 'MB Transfer',
    balanceAfter: 9791.01,
    serviceCharge: 0,
    vat: 0,
    disasterRecovery: 0,
  },
  {
    id: 'tx_1',
    name: 'Tigist Alemu Kebede',
    date: '05-Nov-26 12:44 PM',
    timestamp: Date.now() - 3600000,
    amount: 5000.0,
    type: 'credited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ114',
    receiptId: 'v2-a9KlxNVvrTgUZ3k8mOPq',
    accountNumber: '1000482910534',
    remark: 'MB transfer',
    balanceAfter: 9796.01,
  },
  {
    id: 'tx_2',
    name: 'Yohannes Girma Tesfaye',
    date: '05-Nov-26 12:12 PM',
    timestamp: Date.now() - 7200000,
    amount: 850.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ9G2',
    receiptId: 'v2-z7PqxNVvrTgUZ3k2bXZr',
    accountNumber: '1000531746208',
    remark: 'MB transfer',
    balanceAfter: 4796.01,
  },
  {
    id: 'tx_3',
    name: 'Mekdes Hailu Worku',
    date: '05-Nov-26 11:14 AM',
    timestamp: Date.now() - 10800000,
    amount: 500.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ882',
    receiptId: 'v2-m4YtxNVvrTgUZ3k9cLMk',
    accountNumber: '1000793104826',
    remark: 'MB transfer',
    balanceAfter: 5646.01,
  },
  {
    id: 'tx_4',
    name: 'Air Time',
    date: '04-Nov-26 8:40 PM',
    timestamp: Date.now() - 86400000,
    amount: 45.0,
    type: 'debited',
    category: 'TOP-UP (AIRTIME & DATA RECHARGE)',
    referenceId: 'FT26308HZ721',
    receiptId: 'v2-t2RvxNVvrTgUZ3k4eQWs',
    remark: 'Airtime Recharge',
    balanceAfter: 6146.01,
  },
  {
    id: 'tx_5',
    name: 'Bereket Assefa Desta',
    date: '04-Nov-26 7:39 PM',
    timestamp: Date.now() - 90000000,
    amount: 2000.0,
    type: 'credited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26308HZ643',
    receiptId: 'v2-w8UyxNVvrTgUZ3k6fJKu',
    accountNumber: '1000648219305',
    remark: 'Family Support',
    balanceAfter: 6191.01,
  },
];

const DEFAULT_SECONDARY_ACCOUNT: AccountProfile = {
  id: 'acc_secondary',
  accountName: 'Wadiah Staff Sa',
  accountNumber: '1000839412784',
  balance: 14250.5,
};

const STORAGE_KEYS = {
  BALANCE: 'cbe_balance_v2',
  TRANSACTIONS: 'cbe_transactions_v3',
  RECIPIENTS: 'cbe_recipients_v3',
  USER_NAME: 'cbe_user_name_v3',
  ACCOUNT_NAME: 'cbe_account_name_v2',
  ACCOUNT_NUMBER: 'cbe_account_number_v3',
  PIN: 'cbe_pin_v2',
  DEV_SETTINGS: 'cbe_dev_settings_v2',
  SECONDARY_ACCOUNT: 'cbe_secondary_account_v3',
  ACTIVITY_LOGS: 'cbe_activity_logs_v2',
};

export default function App() {
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAutostart);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'transactions' | 'settings'>('home');
  const [activeAccountIndex, setActiveAccountIndex] = useState<number>(0);

  // Developer Settings
  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.DEV_SETTINGS);
      if (saved) {
        try {
          return { ...DEFAULT_DEVELOPER_SETTINGS, ...JSON.parse(saved) };
        } catch (_) {}
      }
    }
    return DEFAULT_DEVELOPER_SETTINGS;
  });

  // User profile & Primary Balance
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (saved) return saved;
    }
    return 'Seid Mohammed Jemal';
  });

  const [accountName, setAccountName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNT_NAME);
      if (saved) return saved;
    }
    return 'Wadiah Ordinary';
  });

  const [accountNumber, setAccountNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNT_NUMBER);
      if (saved) return saved;
    }
    return '1000758204567';
  });

  const [balance, setBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 9791.01;
  });

  const [secondaryAccount, setSecondaryAccount] = useState<AccountProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SECONDARY_ACCOUNT);
      if (saved) {
        try {
          return { ...DEFAULT_SECONDARY_ACCOUNT, ...JSON.parse(saved) };
        } catch (_) {}
      }
    }
    return DEFAULT_SECONDARY_ACCOUNT;
  });

  const [isBalanceMasked, setIsBalanceMasked] = useState<boolean>(
    developerSettings.defaultBalanceMasked
  );
  const [language, setLanguage] = useState<string>('English');
  const [copied, setCopied] = useState<boolean>(false);

  const [currentPin, setCurrentPin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PIN);
      if (saved) return saved;
    }
    return DEFAULT_AUTH_PIN;
  });
  const [pinLength, setPinLength] = useState<number>(() =>
    currentPin.length === 6 ? 6 : 4
  );

  const [recipientsList, setRecipientsList] = useState<Recipient[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (_) {}
      }
    }
    return INITIAL_RECIPIENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (_) {}
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (_) {}
      }
    }
    return [createActivityLog('SESSION_INIT', 'SYSTEM', 'CBE Mobile Banking initialized')];
  });

  const appendLog = (
    action: string,
    category: ActivityLog['category'],
    details: string,
    status: ActivityLog['status'] = 'SUCCESS'
  ) => {
    setActivityLogs((prev) => [createActivityLog(action, category, details, status), ...prev].slice(0, 50));
  };

  // Persist states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
    } catch (_) {}
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (_) {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(recipientsList));
    } catch (_) {}
  }, [recipientsList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_NAME, accountName);
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_NUMBER, accountNumber);
    } catch (_) {}
  }, [userName, accountName, accountNumber]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PIN, currentPin);
    } catch (_) {}
  }, [currentPin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEV_SETTINGS, JSON.stringify(developerSettings));
    } catch (_) {}
  }, [developerSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECONDARY_ACCOUNT, JSON.stringify(secondaryAccount));
    } catch (_) {}
  }, [secondaryAccount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch (_) {}
  }, [activityLogs]);

  // Derived active account list
  const accountsList: AccountProfile[] = [
    {
      id: 'acc_primary',
      accountName,
      accountNumber,
      balance,
    },
    secondaryAccount,
  ];
  const activeAccount = accountsList[activeAccountIndex] || accountsList[0];

  const cardTimestamp = developerSettings.autoLiveTimestamp
    ? formatCardTimestamp()
    : developerSettings.cardLastUpdated;

  // Transfer & modal state
  const [pendingTransfer, setPendingTransfer] = useState<{
    recipient: Recipient;
    amount: number;
    remark: string;
  } | null>(null);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState<boolean>(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [activeDetailTx, setActiveDetailTx] = useState<Transaction | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isScanQrModalOpen, setIsScanQrModalOpen] = useState(false);
  const [isGovernmentModalOpen, setIsGovernmentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isAirtimeModalOpen, setIsAirtimeModalOpen] = useState(false);
  const [isCbeBirrModalOpen, setIsCbeBirrModalOpen] = useState(false);
  const [isBankingModalOpen, setIsBankingModalOpen] = useState(false);
  const [isPayMerchantModalOpen, setIsPayMerchantModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const [isEntertainmentModalOpen, setIsEntertainmentModalOpen] = useState(false);

  const handleLoginSuccess = (method: 'PIN' | 'BIOMETRIC') => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveBottomTab('home');
    setIsBalanceMasked(developerSettings.defaultBalanceMasked);
    appendLog('LOGIN_SUCCESS', 'AUTH', `Authenticated using ${method}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSettingsModalOpen(false);
    setCurrentScreen('login');
    appendLog('LOGOUT', 'AUTH', 'User signed out & locked app');
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'English' ? 'አማርኛ' : 'English'));
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(activeAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateActiveAccountBalance = (newBal: number) => {
    if (activeAccountIndex === 0) {
      setBalance(newBal);
    } else {
      setSecondaryAccount((prev) => ({ ...prev, balance: newBal }));
    }
  };

  const recordNewTransaction = (
    name: string,
    amount: number,
    category: string,
    remark: string,
    accNumber?: string
  ) => {
    const charges = calculateCharges(amount, developerSettings.applyStandardFees);
    const newBal = Math.max(0, Number((activeAccount.balance - charges.totalDebited).toFixed(2)));
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      name,
      date: formatTransactionDate(),
      timestamp: Date.now(),
      amount,
      type: 'debited',
      category,
      referenceId: generateTransactionId(),
      receiptId: generateReceiptId(),
      accountNumber: accNumber || '1000614289312',
      remark,
      balanceAfter: newBal,
      serviceCharge: charges.serviceCharge,
      vat: charges.vat,
      disasterRecovery: charges.disasterRecovery,
    };

    updateActiveAccountBalance(newBal);
    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceiptTx(newTx);
    setCurrentScreen('receipt');
    appendLog('SERVICE_PAYMENT', 'TRANSACTION', `${category}: ${amount} ETB to ${name}`);
  };

  const handleInitiateTransfer = (recipient: Recipient, amount: number, remark: string) => {
    setPendingTransfer({ recipient, amount, remark });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    setIsConfirmModalOpen(false);
    setIsPinModalOpen(true);
  };

  const handleExecuteTransfer = () => {
    setIsPinModalOpen(false);
    if (!pendingTransfer) return;

    setIsProcessingTransfer(true);

    setTimeout(() => {
      setIsProcessingTransfer(false);

      const { recipient, amount, remark } = pendingTransfer;
      const charges = calculateCharges(amount, developerSettings.applyStandardFees);
      const newBal = Math.max(0, Number((activeAccount.balance - charges.totalDebited).toFixed(2)));
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        name: recipient.name,
        date: formatTransactionDate(),
        timestamp: Date.now(),
        amount,
        type: 'debited',
        category: 'ACCOUNT TO ACCOUNT',
        referenceId: generateTransactionId(),
        receiptId: generateReceiptId(),
        accountNumber: recipient.accountNumber,
        remark: remark || 'MB Transfer',
        balanceAfter: newBal,
        serviceCharge: charges.serviceCharge,
        vat: charges.vat,
        disasterRecovery: charges.disasterRecovery,
      };

      updateActiveAccountBalance(newBal);
      setTransactions((prev) => [newTx, ...prev]);
      setActiveReceiptTx(newTx);
      setCurrentScreen('receipt');
      appendLog('TRANSFER_SUCCESS', 'TRANSACTION', `Transferred ${amount} ETB to ${recipient.name}`);
    }, developerSettings.transferDelayMs);
  };

  const handleAddRecipient = (rec: Recipient) => {
    setRecipientsList((prev) => [rec, ...prev]);
    appendLog('BENEFICIARY_ADDED', 'SETTINGS', `Added ${rec.name} (${rec.accountNumber})`);
  };

  const handleDeleteRecipient = (accNumber: string) => {
    setRecipientsList((prev) => prev.filter((r) => r.accountNumber !== accNumber));
    appendLog('BENEFICIARY_REMOVED', 'SETTINGS', `Removed account ${accNumber}`);
  };

  const handleAddCustomTransaction = (tx: Transaction, adjustBalance: boolean) => {
    setTransactions((prev) => [tx, ...prev]);
    if (adjustBalance) {
      const nextBal =
        tx.type === 'credited'
          ? Number((activeAccount.balance + tx.amount).toFixed(2))
          : Math.max(0, Number((activeAccount.balance - tx.amount).toFixed(2)));
      updateActiveAccountBalance(nextBal);
    }
    appendLog('CUSTOM_TX_ADDED', 'SETTINGS', `${tx.type.toUpperCase()} ${tx.amount} ETB - ${tx.name}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => removeTransactionById(prev, id));
    appendLog('TX_DELETED', 'SETTINGS', `Removed transaction ${id}`);
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    appendLog('TX_CLEARED', 'SETTINGS', 'Cleared all stored transactions');
  };

  const handleResetDefaults = () => {
    setUserName('Seid Mohammed Jemal');
    setAccountName('Wadiah Ordinary');
    setAccountNumber('1000758204567');
    setBalance(9791.01);
    setSecondaryAccount(DEFAULT_SECONDARY_ACCOUNT);
    setActiveAccountIndex(0);
    setCurrentPin(DEFAULT_AUTH_PIN);
    setPinLength(4);
    setRecipientsList(INITIAL_RECIPIENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setDeveloperSettings(DEFAULT_DEVELOPER_SETTINGS);
    setIsBalanceMasked(DEFAULT_DEVELOPER_SETTINGS.defaultBalanceMasked);
    setActivityLogs([createActivityLog('FACTORY_RESET', 'SYSTEM', 'Restored all app defaults')]);
  };

  return (
    <PhoneFrame activeScreen={currentScreen}>
      {!isAuthenticated ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          correctPin={currentPin}
          pinLength={pinLength}
          biometricsEnabled={developerSettings.biometricsEnabled}
        />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden select-none bg-[#F7F7F9]">
          {currentScreen === 'home' && (
            <HomeScreen
              balance={activeAccount.balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
              onNavigate={(screen) => {
                setCurrentScreen(screen);
                if (screen === 'transactions') setActiveBottomTab('transactions');
              }}
              userName={userName}
              accountName={activeAccount.accountName}
              accountNumber={activeAccount.accountNumber}
              lastUpdated={cardTimestamp}
              showCardWorldMap={developerSettings.showCardWorldMap}
              cardIndex={activeAccountIndex}
              totalCards={accountsList.length}
              onSelectCardIndex={setActiveAccountIndex}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              onOpenGovernmentServices={() => setIsGovernmentModalOpen(true)}
              onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
              onOpenScanQr={() => setIsScanQrModalOpen(true)}
              copied={copied}
              onCopyAccount={handleCopyAccount}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenBalanceModal={() => setIsBalanceModalOpen(true)}
              onOpenAirtime={() => setIsAirtimeModalOpen(true)}
              onOpenCbeBirr={() => setIsCbeBirrModalOpen(true)}
              onOpenBankingServices={() => setIsBankingModalOpen(true)}
              onOpenPayMerchant={() => setIsPayMerchantModalOpen(true)}
              onOpenTravel={() => setIsTravelModalOpen(true)}
              onOpenShopping={() => setIsShoppingModalOpen(true)}
              onOpenEntertainment={() => setIsEntertainmentModalOpen(true)}
            />
          )}

          {currentScreen === 'transactions' && (
            <TransactionsScreen
              balance={activeAccount.balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
              transactions={transactions}
              onSelectTransaction={(tx) => setActiveDetailTx(tx)}
              userName={userName}
              accountName={activeAccount.accountName}
              accountNumber={activeAccount.accountNumber}
              lastUpdated={cardTimestamp}
              showCardWorldMap={developerSettings.showCardWorldMap}
              cardIndex={activeAccountIndex}
              totalCards={accountsList.length}
              onSelectCardIndex={setActiveAccountIndex}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              onCopyAccount={handleCopyAccount}
              copied={copied}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenBalanceModal={() => setIsBalanceModalOpen(true)}
            />
          )}

          {currentScreen === 'transfer' && (
            <TransferScreen
              onBack={() => setCurrentScreen('home')}
              onInitiateTransfer={handleInitiateTransfer}
              currentBalance={activeAccount.balance}
              userName={userName}
              accountName={activeAccount.accountName}
              accountNumber={activeAccount.accountNumber}
              recipientsList={recipientsList}
              onDeleteRecipient={handleDeleteRecipient}
              isProcessingTransfer={isProcessingTransfer}
              onOpenScanQr={() => setIsScanQrModalOpen(true)}
              accounts={accountsList}
              activeAccountIndex={activeAccountIndex}
              onSelectAccountIndex={setActiveAccountIndex}
            />
          )}

          {currentScreen === 'receipt' && activeReceiptTx && (
            <ReceiptScreen
              transaction={activeReceiptTx}
              senderName={userName}
              senderAccount={activeAccount.accountNumber}
              remainingBalance={
                activeReceiptTx.balanceAfter !== undefined
                  ? activeReceiptTx.balanceAfter
                  : activeAccount.balance
              }
              onClose={() => {
                setCurrentScreen('transactions');
                setActiveBottomTab('transactions');
              }}
            />
          )}

          {currentScreen !== 'receipt' && (
            <nav className="absolute bottom-0 left-0 right-0 h-[58px] phone:h-[64px] pb-[env(safe-area-inset-bottom,0px)] bg-white border-t border-[#ECECEF] shadow-[0_-2px_10px_rgba(0,0,0,0.02)] flex items-center justify-around z-20 shrink-0">
              <div className="w-full max-w-[500px] mx-auto flex items-center justify-around">
                <button
                  onClick={() => {
                    setCurrentScreen('home');
                    setActiveBottomTab('home');
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] phone:text-[12px] font-bold transition min-w-[74px] phone:min-w-[88px] ${
                    activeBottomTab === 'home' && currentScreen === 'home'
                      ? 'text-[#7B1FA2]'
                      : 'text-[#96939A] hover:text-[#29212E]'
                  }`}
                >
                  <div
                    className={`px-4 phone:px-5 py-1 phone:py-1.5 rounded-full transition ${
                      activeBottomTab === 'home' && currentScreen === 'home'
                        ? 'bg-[#F3EBDD]'
                        : 'bg-transparent'
                    }`}
                  >
                    <Home className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2]" />
                  </div>
                  <span className="leading-none">Home</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentScreen('transactions');
                    setActiveBottomTab('transactions');
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] phone:text-[12px] font-bold transition min-w-[74px] phone:min-w-[88px] ${
                    activeBottomTab === 'transactions' && currentScreen === 'transactions'
                      ? 'text-[#7B1FA2]'
                      : 'text-[#96939A] hover:text-[#29212E]'
                  }`}
                >
                  <div
                    className={`px-4 phone:px-5 py-1 phone:py-1.5 rounded-full transition ${
                      activeBottomTab === 'transactions' && currentScreen === 'transactions'
                        ? 'bg-[#F3EBDD]'
                        : 'bg-transparent'
                    }`}
                  >
                    <Landmark className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2]" />
                  </div>
                  <span className="leading-none">Transactions</span>
                </button>

                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] phone:text-[12px] font-bold transition min-w-[74px] phone:min-w-[88px] ${
                    isSettingsModalOpen
                      ? 'text-[#7B1FA2]'
                      : 'text-[#96939A] hover:text-[#29212E]'
                  }`}
                >
                  <div
                    className={`px-4 phone:px-5 py-1 phone:py-1.5 rounded-full transition ${
                      isSettingsModalOpen ? 'bg-[#F3EBDD]' : 'bg-transparent'
                    }`}
                  >
                    <Settings className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[2]" />
                  </div>
                  <span className="leading-none">Settings</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      )}

      <TransactionDetailModal
        isOpen={Boolean(activeDetailTx)}
        onClose={() => setActiveDetailTx(null)}
        transaction={activeDetailTx}
        onViewReceipt={(tx) => {
          setActiveReceiptTx(tx);
          setActiveDetailTx(null);
          setCurrentScreen('receipt');
        }}
      />

      {pendingTransfer && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmTransfer}
          recipient={pendingTransfer.recipient}
          amount={pendingTransfer.amount}
          senderName={userName}
          senderAccount={activeAccount.accountNumber}
          senderBalance={activeAccount.balance}
          applyStandardFees={developerSettings.applyStandardFees}
        />
      )}

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleExecuteTransfer}
        correctPin={currentPin}
        pinLength={pinLength}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        accountNumber={activeAccount.accountNumber}
        accountName={activeAccount.accountName}
        userName={userName}
      />

      <ScanQrModal
        isOpen={isScanQrModalOpen}
        onClose={() => setIsScanQrModalOpen(false)}
        onScanSuccess={() => {
          setIsScanQrModalOpen(false);
          setCurrentScreen('transfer');
        }}
      />

      <GovernmentServicesModal
        isOpen={isGovernmentModalOpen}
        onClose={() => setIsGovernmentModalOpen(false)}
        onSelectService={(svc) => {
          setIsGovernmentModalOpen(false);
          appendLog('GOV_SERVICE', 'SYSTEM', `Opened ${svc}`);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        onUpdateUserName={(name) => {
          setUserName(name);
          appendLog('PROFILE_UPDATED', 'SETTINGS', `Updated name to ${name}`);
        }}
        balance={balance}
        onUpdateBalance={(newBal) => {
          setBalance(newBal);
          appendLog('BALANCE_UPDATED', 'SETTINGS', `Updated balance to ${newBal} ETB`);
        }}
        accountName={accountName}
        accountNumber={accountNumber}
        onUpdateAccount={(name, num) => {
          setAccountName(name);
          setAccountNumber(num);
          appendLog('ACCOUNT_UPDATED', 'SETTINGS', `${name} (${num})`);
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLogout={handleLogout}
        correctPin={currentPin}
        onChangePin={(newPin, length) => {
          setCurrentPin(newPin);
          setPinLength(length);
          appendLog('PIN_CHANGED', 'SECURITY', `Changed PIN (${length} digits)`);
        }}
        pinLength={pinLength}
        recipientsList={recipientsList}
        onAddRecipient={handleAddRecipient}
        onDeleteRecipient={handleDeleteRecipient}
        transactions={transactions}
        onAddTransaction={handleAddCustomTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onClearTransactions={handleClearTransactions}
        developerSettings={developerSettings}
        onUpdateDeveloperSettings={(next) => {
          setDeveloperSettings(next);
          appendLog('DEV_SETTINGS_UPDATED', 'SETTINGS', 'Updated developer runtime flags');
        }}
        secondaryAccount={secondaryAccount}
        onUpdateSecondaryAccount={(next) => {
          setSecondaryAccount(next);
          appendLog('SECONDARY_ACCOUNT_UPDATED', 'SETTINGS', `${next.accountName} (${next.accountNumber})`);
        }}
        activityLogs={activityLogs}
        onResetDefaults={handleResetDefaults}
      />

      <AccountBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        balance={activeAccount.balance}
        userName={userName}
        accountName={activeAccount.accountName}
        accountNumber={activeAccount.accountNumber}
        onNavigateToTransactions={() => {
          setIsBalanceModalOpen(false);
          setCurrentScreen('transactions');
          setActiveBottomTab('transactions');
        }}
        onNavigateToTransfer={() => {
          setIsBalanceModalOpen(false);
          setCurrentScreen('transfer');
        }}
      />

      <AirtimeModal
        isOpen={isAirtimeModalOpen}
        onClose={() => setIsAirtimeModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessRecharge={(amount, phone, provider, packageType) => {
          recordNewTransaction(
            `${provider} Top-Up`,
            amount,
            'TOP-UP (AIRTIME & DATA RECHARGE)',
            `${packageType} - ${phone}`,
            phone
          );
        }}
      />

      <CbeBirrModal
        isOpen={isCbeBirrModalOpen}
        onClose={() => setIsCbeBirrModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessTransfer={(amount, phone, recipientName, serviceType) => {
          recordNewTransaction(
            recipientName,
            amount,
            'CBE BIRR TRANSFER',
            `${serviceType} - ${phone}`,
            phone
          );
        }}
      />

      <BankingServicesModal
        isOpen={isBankingModalOpen}
        onClose={() => setIsBankingModalOpen(false)}
        balance={activeAccount.balance}
        onNavigateToTransactions={() => {
          setIsBankingModalOpen(false);
          setCurrentScreen('transactions');
          setActiveBottomTab('transactions');
        }}
      />

      <PayMerchantModal
        isOpen={isPayMerchantModalOpen}
        onClose={() => setIsPayMerchantModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessPayMerchant={(amount, merchantName, tillNumber) => {
          recordNewTransaction(
            merchantName,
            amount,
            'MERCHANT PAYMENT',
            `Till: ${tillNumber}`,
            tillNumber
          );
        }}
      />

      <TravelModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessPayTravel={(amount, serviceName, bookingRef) => {
          recordNewTransaction(
            serviceName,
            amount,
            'TRAVEL & TRANSPORT',
            `Booking Ref: ${bookingRef}`,
            bookingRef
          );
        }}
      />

      <ShoppingModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessPayShopping={(amount, storeName, orderNumber) => {
          recordNewTransaction(
            storeName,
            amount,
            'SHOPPING & RETAIL',
            `Order: ${orderNumber}`,
            orderNumber
          );
        }}
      />

      <EntertainmentModal
        isOpen={isEntertainmentModalOpen}
        onClose={() => setIsEntertainmentModalOpen(false)}
        balance={activeAccount.balance}
        onSuccessPayEntertainment={(amount, eventName, ticketCount) => {
          recordNewTransaction(
            eventName,
            amount,
            'ENTERTAINMENT & TICKETS',
            `${ticketCount} Admission Ticket(s)`,
            'CBE-TICKET'
          );
        }}
      />
    </PhoneFrame>
  );
}
