import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Bell, History, GitBranch, ShieldCheck } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeScreen: string;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenActivityLogs: () => void;
  onOpenCiCd: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenActivityLogs,
  onOpenCiCd,
}) => {
  const [currentTime, setCurrentTime] = useState('17:28');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-900 flex flex-col items-center justify-start md:justify-center p-0 md:p-6 selection:bg-purple-200">
      {/* Top desktop quick helper bar */}
      <header className="w-full max-w-md hidden md:flex items-center justify-between text-xs text-neutral-400 mb-3 px-2">
        <div className="flex items-center gap-1.5 font-medium text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CBE Mobile v5.2.1 • Online</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCiCd}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition border border-neutral-700 font-mono text-[11px]"
            title="GitHub CI/CD & Testing Distribution"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>CI/CD Workflow</span>
          </button>
          <button
            onClick={onOpenActivityLogs}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition border border-neutral-700 text-[11px]"
            title="Security Audit & Activity Logs"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Activity Logs</span>
          </button>
        </div>
      </header>

      {/* Flagship smartphone frame */}
      <div className="relative w-full max-w-[420px] h-[100dvh] md:h-[870px] bg-[#F5F3EC] md:rounded-[44px] overflow-hidden shadow-2xl flex flex-col border-0 md:border-[10px] md:border-neutral-900 ring-1 ring-neutral-800">
        {/* Status bar */}
        <div className="w-full h-8 px-6 pt-2 pb-1 bg-transparent flex items-center justify-between z-40 select-none text-[13px] font-semibold tracking-tight text-neutral-800">
          <span>{currentTime}</span>
          
          {/* Camera notch / punch hole */}
          <div className="w-4 h-4 rounded-full bg-black/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a233a]"></div>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-800">
            <span className="text-[10px] font-bold text-neutral-700">4G+</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[11px]">73%</span>
              <Battery className="w-4 h-4 fill-neutral-800" />
            </div>
          </div>
        </div>

        {/* Dynamic screen content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Global floating quick actions trigger on mobile */}
        <div className="md:hidden absolute top-2 right-4 flex items-center gap-2 z-50">
          <button
            onClick={onOpenNotifications}
            className="w-7 h-7 rounded-full bg-purple-900/60 text-white flex items-center justify-center relative backdrop-blur-sm"
            aria-label="Push notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                {unreadNotifsCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenActivityLogs}
            className="w-7 h-7 rounded-full bg-purple-900/60 text-white flex items-center justify-center backdrop-blur-sm"
            aria-label="Activity logs"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Android bottom navigation pill handle */}
        <div className="w-full h-4 bg-[#F5F3EC] flex items-center justify-center py-1 select-none">
          <div className="w-32 h-1 rounded-full bg-neutral-400/80"></div>
        </div>
      </div>
    </div>
  );
};
