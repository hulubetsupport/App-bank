import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  Transaction,
  Recipient,
} from './types/index.ts';
import {
  generateTransactionId,
  generateReceiptId,
  INITIAL_RECIPIENTS,
  DEFAULT_AUTH_PIN,
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
    id: 'tx_bilal',
    name: 'Bilal Seid',
    date: '06-Nov-26 10:54 PM',
    timestamp: Date.now() - 120000,
    amount: 5.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26311KH4GH',
    receiptId: 'v2-hfHCxNVvrTgUZ3k1kOTg',
    accountNumber: '1000382106157',
    remark: 'MB Transfer',
    balanceAfter: 9791.01,
  },
  {
    id: 'tx_1',
    name: 'Sofiya Seid',
    date: '05-Nov-26 12:44 PM',
    timestamp: Date.now() - 3600000,
    amount: 5000.0,
    type: 'credited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ114',
    receiptId: 'v2-a9KlxNVvrTgUZ3k8mOPq',
    accountNumber: '1000392819143',
    remark: 'MB transfer',
    balanceAfter: 9796.01,
  },
  {
    id: 'tx_2',
    name: 'Tsegaye Abebe',
    date: '05-Nov-26 12:12 PM',
    timestamp: Date.now() - 7200000,
    amount: 850.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ9G2',
    receiptId: 'v2-z7PqxNVvrTgUZ3k2bXZr',
    accountNumber: '1000066327314',
    remark: 'MB transfer',
    balanceAfter: 4796.01,
  },
  {
    id: 'tx_3',
    name: 'Abdu Mohammed',
    date: '05-Nov-26 11:14 AM',
    timestamp: Date.now() - 10800000,
    amount: 500.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ882',
    receiptId: 'v2-m4YtxNVvrTgUZ3k9cLMk',
    accountNumber: '1000639261186',
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
    name: 'Aminat Mohammed',
    date: '04-Nov-26 7:39 PM',
    timestamp: Date.now() - 90000000,
    amount: 2000.0,
    type: 'credited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26308HZ643',
    receiptId: 'v2-w8UyxNVvrTgUZ3k6fJKu',
    accountNumber: '1000782917997',
    remark: 'Family Support',
    balanceAfter: 6191.01,
  },
];

const STORAGE_KEYS = {
  BALANCE: 'cbe_balance_v2',
  TRANSACTIONS: 'cbe_transactions_v2',
  RECIPIENTS: 'cbe_recipients_v2',
  USER_NAME: 'cbe_user_name_v2',
  ACCOUNT_NAME: 'cbe_account_name_v2',
  ACCOUNT_NUMBER: 'cbe_account_number_v2',
  PIN: 'cbe_pin_v2',
};

export default function App() {
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAutostart);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'transactions' | 'settings'>('home');

  // User profile & Balance stored in mobile database (localStorage)
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (saved) return saved;
    }
    return 'Aymen Kemal Ali';
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
    return '1000562339427';
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

  // Always masked by default: "ሁሌ የገንዘብ መጠኑ ****** ይሁን እኔ ስነካው ብቻ ነው መታየት ያለበት ሁሉም"
  const [isBalanceMasked, setIsBalanceMasked] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('English');
  const [copied, setCopied] = useState<boolean>(false);

  // Security PIN (default 0607, supports 4 or 6 digits)
  const [currentPin, setCurrentPin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PIN);
      if (saved) return saved;
    }
    return DEFAULT_AUTH_PIN;
  });
  const [pinLength, setPinLength] = useState<number>(4);

  // Beneficiaries & Transactions stored in mobile database (localStorage)
  const [recipientsList, setRecipientsList] = useState<Recipient[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Persist balance changes to local database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
    } catch (_) {}
  }, [balance]);

  // Persist transactions list to local database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (_) {}
  }, [transactions]);

  // Persist beneficiaries to local database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(recipientsList));
    } catch (_) {}
  }, [recipientsList]);

  // Persist user profile and PIN to local database
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

  // Transfer flow
  const [pendingTransfer, setPendingTransfer] = useState<{
    recipient: Recipient;
    amount: number;
    remark: string;
  } | null>(null);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState<boolean>(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [activeDetailTx, setActiveDetailTx] = useState<Transaction | null>(null);

  // Modals
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

  // Handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveBottomTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSettingsModalOpen(false);
    setCurrentScreen('login');
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'English' ? 'አማርኛ' : 'English'));
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to record new activities with revealed balance tracking and immediate receipt
  const recordNewTransaction = (
    name: string,
    amount: number,
    category: string,
    remark: string,
    accNumber?: string
  ) => {
    const txId = generateTransactionId();
    const rcptId = generateReceiptId();
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${String(
      now.getFullYear()
    ).slice(-2)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newBal = Math.max(0, balance - amount);
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      name,
      date: dateFormatted,
      timestamp: Date.now(),
      amount,
      type: 'debited',
      category,
      referenceId: txId,
      receiptId: rcptId,
      accountNumber: accNumber || '1000382106157',
      remark,
      balanceAfter: newBal,
    };

    setBalance(newBal);
    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceiptTx(newTx);
    setCurrentScreen('receipt');
  };

  // Transfer Step 1: user clicks Continue on Transfer screen -> opens Confirm modal
  const handleInitiateTransfer = (recipient: Recipient, amount: number, remark: string) => {
    setPendingTransfer({ recipient, amount, remark });
    setIsConfirmModalOpen(true);
  };

  // Transfer Step 2: user clicks Continue on Confirm modal -> opens PIN modal
  const handleConfirmTransfer = () => {
    setIsConfirmModalOpen(false);
    setIsPinModalOpen(true);
  };

  // Transfer Step 3: PIN is confirmed -> show 360° purple rotating circle loader for 1.8s, then open receipt!
  const handleExecuteTransfer = () => {
    setIsPinModalOpen(false);
    if (!pendingTransfer) return;

    setIsProcessingTransfer(true);

    setTimeout(() => {
      setIsProcessingTransfer(false);

      const { recipient, amount, remark } = pendingTransfer;
      const txId = generateTransactionId();
      const rcptId = generateReceiptId();

      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${String(
        now.getFullYear()
      ).slice(-2)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newBal = Math.max(0, balance - amount);
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        name: recipient.name,
        date: dateFormatted,
        timestamp: Date.now(),
        amount,
        type: 'debited',
        category: 'ACCOUNT TO ACCOUNT',
        referenceId: txId,
        receiptId: rcptId,
        accountNumber: recipient.accountNumber,
        remark: remark || 'MB Transfer',
        balanceAfter: newBal,
      };

      setBalance(newBal);
      setTransactions((prev) => [newTx, ...prev]);
      setActiveReceiptTx(newTx);
      setCurrentScreen('receipt');
    }, 1800);
  };

  // Adding and deleting beneficiaries from settings
  const handleAddRecipient = (rec: Recipient) => {
    setRecipientsList((prev) => [rec, ...prev]);
  };

  const handleDeleteRecipient = (accNumber: string) => {
    setRecipientsList((prev) => prev.filter((r) => r.accountNumber !== accNumber));
  };

  return (
    <PhoneFrame activeScreen={currentScreen}>
      {/* Screen Router */}
      {!isAuthenticated ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          correctPin={currentPin}
          pinLength={pinLength}
        />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden select-none bg-[#F7F7F9]">
          {currentScreen === 'home' && (
            <HomeScreen
              balance={balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
              onNavigate={(screen) => {
                setCurrentScreen(screen);
                if (screen === 'transactions') setActiveBottomTab('transactions');
              }}
              userName={userName}
              accountName={accountName}
              accountNumber={accountNumber}
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
              balance={balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
              transactions={transactions}
              onSelectTransaction={(tx) => {
                setActiveDetailTx(tx);
              }}
              userName={userName}
              accountName={accountName}
              accountNumber={accountNumber}
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
              currentBalance={balance}
              userName={userName}
              accountName={accountName}
              accountNumber={accountNumber}
              recipientsList={recipientsList}
              onDeleteRecipient={handleDeleteRecipient}
              isProcessingTransfer={isProcessingTransfer}
            />
          )}

          {currentScreen === 'receipt' && activeReceiptTx && (
            <ReceiptScreen
              transaction={activeReceiptTx}
              senderName={userName}
              senderAccount={accountNumber}
              remainingBalance={activeReceiptTx.balanceAfter !== undefined ? activeReceiptTx.balanceAfter : balance}
              onClose={() => {
                setCurrentScreen('transactions');
                setActiveBottomTab('transactions');
              }}
            />
          )}

          {/* Bottom Navigation Bar: White background, #ECECEF border, #7B1FA2 active icon, #F3EBDD active pill */}
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

      {/* Transaction Detail Bottom Sheet (IMG_20261106_230128_152_4cbf5aa2.jpg) */}
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

      {/* Confirmation Bottom Sheet (IMG_20261106_230128_091_80078464.jpg) */}
      {pendingTransfer && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmTransfer}
          recipient={pendingTransfer.recipient}
          amount={pendingTransfer.amount}
          senderName={userName}
          senderAccount={accountNumber}
          senderBalance={balance}
        />
      )}

      {/* PIN Keypad Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleExecuteTransfer}
        correctPin={currentPin}
        pinLength={pinLength}
      />

      {/* Receive Money QR Modal */}
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        accountNumber={accountNumber}
        accountName={accountName}
        userName={userName}
      />

      {/* Scan QR Modal */}
      <ScanQrModal
        isOpen={isScanQrModalOpen}
        onClose={() => setIsScanQrModalOpen(false)}
        onScanSuccess={(recipient) => {
          setIsScanQrModalOpen(false);
          setCurrentScreen('transfer');
        }}
      />

      {/* Government Services Modal */}
      <GovernmentServicesModal
        isOpen={isGovernmentModalOpen}
        onClose={() => setIsGovernmentModalOpen(false)}
        onSelectService={() => {
          setIsGovernmentModalOpen(false);
        }}
      />

      {/* Settings Modal (Name, Account, Balance, Hidden PIN Change, Saved Beneficiaries) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        onUpdateUserName={(name) => setUserName(name)}
        balance={balance}
        onUpdateBalance={(newBal) => setBalance(newBal)}
        accountName={accountName}
        accountNumber={accountNumber}
        onUpdateAccount={(name, num) => {
          setAccountName(name);
          setAccountNumber(num);
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLogout={handleLogout}
        correctPin={currentPin}
        onChangePin={(newPin, length) => {
          setCurrentPin(newPin);
          setPinLength(length);
        }}
        pinLength={pinLength}
        recipientsList={recipientsList}
        onAddRecipient={handleAddRecipient}
        onDeleteRecipient={handleDeleteRecipient}
      />

      {/* Account Balance & Downward Details Modal */}
      <AccountBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        balance={balance}
        userName={userName}
        accountName={accountName}
        accountNumber={accountNumber}
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

      {/* Airtime & Packages Modal */}
      <AirtimeModal
        isOpen={isAirtimeModalOpen}
        onClose={() => setIsAirtimeModalOpen(false)}
        balance={balance}
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

      {/* CBE Birr Wallet Services Modal */}
      <CbeBirrModal
        isOpen={isCbeBirrModalOpen}
        onClose={() => setIsCbeBirrModalOpen(false)}
        balance={balance}
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

      {/* Banking Services Modal */}
      <BankingServicesModal
        isOpen={isBankingModalOpen}
        onClose={() => setIsBankingModalOpen(false)}
        balance={balance}
        onNavigateToTransactions={() => {
          setIsBankingModalOpen(false);
          setCurrentScreen('transactions');
          setActiveBottomTab('transactions');
        }}
      />

      {/* Pay Merchant Modal */}
      <PayMerchantModal
        isOpen={isPayMerchantModalOpen}
        onClose={() => setIsPayMerchantModalOpen(false)}
        balance={balance}
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

      {/* Travel & Transport Modal */}
      <TravelModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        balance={balance}
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

      {/* Shopping & Retail Modal */}
      <ShoppingModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        balance={balance}
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

      {/* Entertainment & Tickets Modal */}
      <EntertainmentModal
        isOpen={isEntertainmentModalOpen}
        onClose={() => setIsEntertainmentModalOpen(false)}
        balance={balance}
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
