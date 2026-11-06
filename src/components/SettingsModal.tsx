import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Bell,
  Lock,
  Globe,
  GitBranch,
  History,
  LogOut,
  ChevronRight,
  Check,
  User,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSwitchUser: () => void;
  language: string;
  onToggleLanguage: () => void;
  onLogout: () => void;
  onOpenCiCd: () => void;
  onOpenActivityLogs: () => void;
  onOpenNotifications: () => void;
  onNotice: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  onSwitchUser,
  language,
  onToggleLanguage,
  onLogout,
  onOpenCiCd,
  onOpenActivityLogs,
  onOpenNotifications,
  onNotice,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] max-h-[85%] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C21A4] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">Settings &amp; Profile</h3>
              <p className="text-[10px] text-neutral-400">Account: Wadiah Ordinary 1000562339427</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Items */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 text-xs">
          {/* User profile toggle */}
          <div
            onClick={onSwitchUser}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between cursor-pointer border border-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#7C21A4]" />
              <div>
                <div className="font-bold text-neutral-800">Active Profile: {userName}</div>
                <div className="text-[10px] text-neutral-500">Tap to switch user profile</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Security & Password */}
          <div
            onClick={() => onNotice('Real Password set to 0607')}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between cursor-pointer border border-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#7C21A4]" />
              <div>
                <div className="font-bold text-neutral-800">Security &amp; PIN</div>
                <div className="text-[10px] text-neutral-500">
                  Current PIN: <span className="font-mono font-bold text-neutral-800">0607</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Real-time Push Notifications toggle */}
          <div className="p-3 rounded-2xl bg-neutral-50 flex items-center justify-between border border-neutral-200">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#7C21A4]" />
              <div>
                <div className="font-bold text-neutral-800">Push Notifications</div>
                <div className="text-[10px] text-neutral-500">Instant debit and credit alerts</div>
              </div>
            </div>
            <button
              onClick={() => {
                setPushEnabled(!pushEnabled);
                onNotice(pushEnabled ? 'Push notifications disabled' : 'Push notifications enabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                pushEnabled ? 'bg-[#7C21A4]' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  pushEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Language toggle */}
          <div
            onClick={onToggleLanguage}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between cursor-pointer border border-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-[#7C21A4]" />
              <div>
                <div className="font-bold text-neutral-800">App Language</div>
                <div className="text-[10px] text-neutral-500">Current: {language}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#7C21A4]">{language} ▾</span>
          </div>

          {/* Activity Logs trigger */}
          <div
            onClick={() => {
              onClose();
              onOpenActivityLogs();
            }}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between cursor-pointer border border-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-amber-600" />
              <div>
                <div className="font-bold text-neutral-800">Detailed Activity Tracking</div>
                <div className="text-[10px] text-neutral-500">View audit logs &amp; export data</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* GitHub CI/CD trigger */}
          <div
            onClick={() => {
              onClose();
              onOpenCiCd();
            }}
            className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between cursor-pointer border border-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-purple-600" />
              <div>
                <div className="font-bold text-neutral-900">GitHub CI/CD &amp; Testing Package</div>
                <div className="text-[10px] text-neutral-500">Continuous integration &amp; distribution</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Logout button */}
          <div className="pt-3">
            <button
              onClick={onLogout}
              className="w-full h-11 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-[0.99] text-red-700 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out &amp; Lock CBE App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
