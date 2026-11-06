import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  Transaction,
  Recipient,
  ActivityLog,
  NotificationItem,
} from './types/index.ts';
import {
  formatETB,
  createActivityLog,
  createPushNotification,
  generateTransactionId,
  INITIAL_RECIPIENTS,
  DEFAULT_AUTH_PIN,
} from './utils/banking.ts';
import { playChime } from './utils/audio.ts';
import { PhoneFrame } from './components/PhoneFrame.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { TransactionsScreen } from './components/TransactionsScreen.tsx';
import { TransferScreen } from './components/TransferScreen.tsx';
import { ReceiptScreen } from './components/ReceiptScreen.tsx';
import { ConfirmModal } from './components/ConfirmModal.tsx';
import { PinModal } from './components/PinModal.tsx';
import { GovernmentServicesModal } from './components/GovernmentServicesModal.tsx';
import { PushNotificationBanner } from './components/PushNotificationBanner.tsx';
import { NotificationCenterDrawer } from './components/NotificationCenterDrawer.tsx';
import { ActivityLogDrawer } from './components/ActivityLogDrawer.tsx';
import { GithubCiModal } from './components/GithubCiModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ReceiveModal } from './components/ReceiveModal.tsx';
import { ScanQrModal } from './components/ScanQrModal.tsx';
import { Home, Landmark, Settings, Check } from 'lucide-react';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    name: 'Sofiya Seid',
    date: '05-Nov-26 12:44 PM',
    timestamp: Date.now() - 3600000,
    amount: 5000.0,
    type: 'credited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26309HZ114',
    accountNumber: '1000392819143',
    remark: 'MB transfer',
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
    accountNumber: '1000293817314',
    remark: 'MB transfer',
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
    accountNumber: '1000592813321',
    remark: 'MB transfer',
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
    remark: 'Airtime Recharge',
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
    accountNumber: '1000782910012',
    remark: 'Family Support',
  },
  {
    id: 'tx_6',
    name: 'Bilal Seid',
    date: '04-Nov-26 3:20 PM',
    timestamp: Date.now() - 95000000,
    amount: 400.0,
    type: 'debited',
    category: 'ACCOUNT TO ACCOUNT',
    referenceId: 'FT26308HZ510',
    accountNumber: '1000382106157',
    remark: 'MB transfer',
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  createActivityLog('SESSION_INITIALIZED', 'SYSTEM', 'CBE Mobile Application loaded securely'),
  createActivityLog('SECURITY_CHECK', 'SECURITY', 'Device integrity and TLS 1.3 encryption verified'),
  createActivityLog(
    'PREVIOUS_SESSION_LOGIN',
    'AUTH',
    'Previous login verified via credential PIN 0607 on Redmi Note 11'
  ),
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  createPushNotification(
    'CBE Credit Alert',
    'ETB 5,000.00 credited to Wadiah Ordinary 1000562339427 from Sofiya Seid Yesuf.',
    'TRANSACTION',
    5000
  ),
  createPushNotification(
    'CBE Debit Alert',
    'ETB 850.00 debited from Wadiah Ordinary 1000562339427 for Tsegaye Abebe Berihun.',
    'TRANSACTION',
    -850
  ),
];

export default function App() {
  // Check for Ultra Mode autostart
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAutostart);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'transactions' | 'settings'>('home');
  const [balance, setBalance] = useState<number>(15683.01);
  const [isBalanceMasked, setIsBalanceMasked] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Aymen');
  const [language, setLanguage] = useState<string>('English');
  const [copied, setCopied] = useState<boolean>(false);

  // Data lists
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Transfer flow states
  const [pendingTransfer, setPendingTransfer] = useState<{
    recipient: Recipient;
    amount: number;
    remark: string;
  } | null>(null);
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);

  // Modals & Drawers
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isScanQrModalOpen, setIsScanQrModalOpen] = useState(false);
  const [isGovernmentModalOpen, setIsGovernmentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isCiCdModalOpen, setIsCiCdModalOpen] = useState(false);

  // Live Toast & Push Banner
  const [activePush, setActivePush] = useState<NotificationItem | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Show a momentary toast
  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => {
      setToastNotice((curr) => (curr === msg ? null : curr));
    }, 2200);
  };

  // Add an activity log
  const logEvent = (
    action: string,
    category: ActivityLog['category'],
    details: string,
    status: ActivityLog['status'] = 'SUCCESS'
  ) => {
    const entry = createActivityLog(action, category, details, status);
    setActivityLogs((prev) => [entry, ...prev]);
  };

  // Trigger push alert
  const triggerPushAlert = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'TRANSACTION',
    amount?: number
  ) => {
    playChime('notification');
    const notif = createPushNotification(title, message, type, amount);
    setNotifications((prev) => [notif, ...prev]);
    setActivePush(notif);

    // Also attempt browser push if granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body: message,
            icon: 'https://i.postimg.cc/Hk1pN2VS/20260805-174301.png',
          });
        } catch {
          // ignore
        }
      }
    }
  };

  // Authentication
  const handleLoginSuccess = (method: 'PIN' | 'BIOMETRIC') => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveBottomTab('home');
    logEvent(
      'AUTH_LOGIN_SUCCESS',
      'AUTH',
      `User ${userName} logged in successfully via ${method} (PIN 0607)`
    );
    triggerPushAlert(
      'Login Notification',
      `Welcome to CBE Mobile Banking. Session authenticated via ${method}.`,
      'SECURITY'
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSettingsModalOpen(false);
    setCurrentScreen('login');
    logEvent('AUTH_LOGOUT', 'AUTH', `User ${userName} signed out and locked the app`);
    showToast('Signed out successfully');
  };

  const handleSwitchUser = () => {
    const nextUser = userName === 'Aymen' ? 'Abdurahman' : 'Aymen';
    setUserName(nextUser);
    logEvent('PROFILE_SWITCH', 'SETTINGS', `Active profile switched to ${nextUser}`);
    showToast(`Switched user profile to ${nextUser}`);
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'English' ? 'አማርኛ' : 'English';
    setLanguage(nextLang);
    logEvent('LANGUAGE_CHANGED', 'SETTINGS', `Interface language updated to ${nextLang}`);
    showToast(`Language set to ${nextLang}`);
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('1000562339427');
    setCopied(true);
    playChime('tap');
    showToast('Account copied: 1000562339427');
    logEvent('ACCOUNT_NUMBER_COPIED', 'SECURITY', 'Account number 1000562339427 copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Transfer Initiation
  const handleInitiateTransfer = (recipient: Recipient, amount: number, remark: string) => {
    setPendingTransfer({ recipient, amount, remark });
    setIsConfirmModalOpen(true);
    logEvent(
      'TRANSFER_INITIATED',
      'TRANSACTION',
      `Transfer draft of ETB ${formatETB(amount)} to ${recipient.name} (${recipient.accountNumber})`
    );
  };

  const handleConfirmTransfer = () => {
    setIsConfirmModalOpen(false);
    setIsPinModalOpen(true);
  };

  // Transfer Execution
  const handleExecuteTransfer = () => {
    setIsPinModalOpen(false);
    if (!pendingTransfer) return;

    const { recipient, amount, remark } = pendingTransfer;
    const txId = generateTransactionId();

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${String(
      now.getFullYear()
    ).slice(-2)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      name: recipient.name,
      date: dateFormatted,
      timestamp: Date.now(),
      amount,
      type: 'debited',
      category: 'ACCOUNT TO ACCOUNT',
      referenceId: txId,
      accountNumber: recipient.accountNumber,
      remark: remark || 'MB transfer',
    };

    // Deduct balance
    const updatedBalance = balance - amount;
    setBalance(updatedBalance);
    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceiptTx(newTx);
    setCurrentScreen('receipt');

    // Audit Log
    logEvent(
      'TRANSFER_COMPLETED',
      'TRANSACTION',
      `Debited ETB ${formatETB(amount)} for ${recipient.name} (${recipient.accountNumber}). Ref: ${txId}`,
      'SUCCESS'
    );

    // Trigger Push Notification
    triggerPushAlert(
      'CBE Debit Alert',
      `ETB ${formatETB(amount)} debited from Wadiah Ordinary 1000562339427 for ${recipient.name} on ${dateFormatted}. Ref: ${txId}`,
      'TRANSACTION',
      -amount
    );
  };

  // Simulate Incoming Transfer for Instant Push Testing
  const handleSimulateIncomingMoney = () => {
    const incomingAmt = 1500.0;
    const newBal = balance + incomingAmt;
    setBalance(newBal);

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${months[now.getMonth()]}-${String(
      now.getFullYear()
    ).slice(-2)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const txId = generateTransactionId();
    const creditTx: Transaction = {
      id: 'tx_inc_' + Date.now(),
      name: 'Bilal Seid Abdu',
      date: dateFormatted,
      timestamp: Date.now(),
      amount: incomingAmt,
      type: 'credited',
      category: 'ACCOUNT TO ACCOUNT',
      referenceId: txId,
      accountNumber: '1000382106157',
      remark: 'Project payment',
    };

    setTransactions((prev) => [creditTx, ...prev]);

    logEvent(
      'INCOMING_TRANSFER_CREDITED',
      'TRANSACTION',
      `Credited ETB ${formatETB(incomingAmt)} from Bilal Seid Abdu (1000382106157). Ref: ${txId}`,
      'SUCCESS'
    );

    triggerPushAlert(
      'CBE Credit Alert',
      `ETB ${formatETB(incomingAmt)} credited to Wadiah Ordinary 1000562339427 from Bilal Seid Abdu. Ref: ${txId}`,
      'TRANSACTION',
      incomingAmt
    );

    showToast(`Received ETB ${formatETB(incomingAmt)} from Bilal Seid Abdu`);
  };

  // PWA install trigger
  const handleInstallPwa = () => {
    showToast('App ready! Add to Home Screen via your browser menu for standalone mode.');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <PhoneFrame
      activeScreen={currentScreen}
      unreadNotifsCount={unreadNotifsCount}
      onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
      onOpenActivityLogs={() => setIsActivityLogsOpen(true)}
      onOpenCiCd={() => setIsCiCdModalOpen(true)}
    >
      {/* Real-time Top Push Notification Banner */}
      <PushNotificationBanner
        notification={activePush}
        onDismiss={() => setActivePush(null)}
        onOpenDetails={(notif) => {
          setActivePush(null);
          setIsNotificationsDrawerOpen(true);
        }}
      />

      {/* Screen Routing */}
      {!isAuthenticated ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
          language={language}
          onToggleLanguage={handleToggleLanguage}
        />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {currentScreen === 'home' && (
            <HomeScreen
              balance={balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => {
                setIsBalanceMasked(!isBalanceMasked);
                logEvent(
                  'BALANCE_VISIBILITY_TOGGLED',
                  'SECURITY',
                  isBalanceMasked ? 'Balance unmasked' : 'Balance masked'
                );
              }}
              onNavigate={(screen) => {
                setCurrentScreen(screen);
                if (screen === 'transactions') setActiveBottomTab('transactions');
              }}
              userName={userName}
              onSwitchUser={handleSwitchUser}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              onOpenGovernmentServices={() => setIsGovernmentModalOpen(true)}
              onQuickActionNotice={showToast}
              onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
              onOpenScanQr={() => setIsScanQrModalOpen(true)}
              copied={copied}
              onCopyAccount={handleCopyAccount}
            />
          )}

          {currentScreen === 'transactions' && (
            <TransactionsScreen
              balance={balance}
              isBalanceMasked={isBalanceMasked}
              onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
              transactions={transactions}
              onSelectTransaction={(tx) => {
                setActiveReceiptTx(tx);
                setCurrentScreen('receipt');
              }}
              userName={userName}
              onSwitchUser={handleSwitchUser}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              onCopyAccount={handleCopyAccount}
              copied={copied}
            />
          )}

          {currentScreen === 'transfer' && (
            <TransferScreen
              onBack={() => setCurrentScreen('home')}
              onInitiateTransfer={handleInitiateTransfer}
              currentBalance={balance}
              userName={userName}
            />
          )}

          {currentScreen === 'receipt' && activeReceiptTx && (
            <ReceiptScreen
              transaction={activeReceiptTx}
              senderName={userName === 'Aymen' ? 'Aymen Kemal Ali' : 'Abdurahman'}
              onDone={() => {
                setCurrentScreen('transactions');
                setActiveBottomTab('transactions');
              }}
              onShareNotice={showToast}
            />
          )}

          {/* Bottom Navigation Bar */}
          {currentScreen !== 'receipt' && (
            <nav className="absolute bottom-0 left-0 right-0 h-15 bg-[#F5F3EC] border-t border-[#ded9cc] flex items-center justify-around z-20">
              <button
                onClick={() => {
                  setCurrentScreen('home');
                  setActiveBottomTab('home');
                }}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-bold transition min-w-[70px] ${
                  activeBottomTab === 'home' && currentScreen === 'home'
                    ? 'text-[#7C21A4]'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div
                  className={`px-3.5 py-1 rounded-full transition ${
                    activeBottomTab === 'home' && currentScreen === 'home'
                      ? 'bg-[#e9dec9]'
                      : 'bg-transparent'
                  }`}
                >
                  <Home className="w-5 h-5" />
                </div>
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setCurrentScreen('transactions');
                  setActiveBottomTab('transactions');
                }}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-bold transition min-w-[70px] ${
                  activeBottomTab === 'transactions' && currentScreen === 'transactions'
                    ? 'text-[#7C21A4]'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div
                  className={`px-3.5 py-1 rounded-full transition ${
                    activeBottomTab === 'transactions' && currentScreen === 'transactions'
                      ? 'bg-[#e9dec9]'
                      : 'bg-transparent'
                  }`}
                >
                  <Landmark className="w-5 h-5" />
                </div>
                <span>Transactions</span>
              </button>

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-bold transition min-w-[70px] ${
                  isSettingsModalOpen
                    ? 'text-[#7C21A4]'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div className="px-3.5 py-1 rounded-full transition bg-transparent">
                  <Settings className="w-5 h-5" />
                </div>
                <span>Settings</span>
              </button>
            </nav>
          )}
        </div>
      )}

      {/* Confirmation Bottom Sheet */}
      {pendingTransfer && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmTransfer}
          recipient={pendingTransfer.recipient}
          amount={pendingTransfer.amount}
          senderName={userName === 'Aymen' ? 'Aymen Kemal Ali' : 'Abdurahman'}
        />
      )}

      {/* 6-PIN Bottom Sheet */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleExecuteTransfer}
      />

      {/* Receive Money QR Modal */}
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        accountNumber="1000562339427"
        accountName="Wadiah Ordinary"
        userName={userName === 'Aymen' ? 'Aymen Kemal Ali' : 'Abdurahman'}
      />

      {/* Scan QR Modal */}
      <ScanQrModal
        isOpen={isScanQrModalOpen}
        onClose={() => setIsScanQrModalOpen(false)}
        onScanSuccess={(recipient) => {
          setIsScanQrModalOpen(false);
          setCurrentScreen('transfer');
          showToast(`QR Code scanned: ${recipient.name}`);
        }}
      />

      {/* Government Services Modal */}
      <GovernmentServicesModal
        isOpen={isGovernmentModalOpen}
        onClose={() => setIsGovernmentModalOpen(false)}
        onSelectService={(name) => {
          setIsGovernmentModalOpen(false);
          showToast(`Opened ${name} Portal`);
          logEvent('GOV_SERVICE_OPENED', 'SYSTEM', `User accessed ${name}`);
        }}
      />

      {/* Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('Marked all notifications as read');
        }}
        onSimulateIncoming={handleSimulateIncomingMoney}
      />

      {/* Detailed Activity Tracking Drawer */}
      <ActivityLogDrawer
        isOpen={isActivityLogsOpen}
        onClose={() => setIsActivityLogsOpen(false)}
        logs={activityLogs}
      />

      {/* GitHub CI/CD & App Distribution Modal */}
      <GithubCiModal
        isOpen={isCiCdModalOpen}
        onClose={() => setIsCiCdModalOpen(false)}
        onInstallPwa={handleInstallPwa}
        isInstallable={true}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        onSwitchUser={handleSwitchUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLogout={handleLogout}
        onOpenCiCd={() => setIsCiCdModalOpen(true)}
        onOpenActivityLogs={() => setIsActivityLogsOpen(true)}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        onNotice={showToast}
      />

      {/* Global Toast Notification */}
      {toastNotice && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm pointer-events-none transition animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
          {toastNotice}
        </div>
      )}
    </PhoneFrame>
  );
}
