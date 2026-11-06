import React from 'react';
import {
  X,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Info,
  Check,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { NotificationItem } from '../types/index.ts';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSimulateIncoming: () => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSimulateIncoming,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] max-h-[85%] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C21A4] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">
                Push Notifications
              </h3>
              <p className="text-[10px] text-neutral-400">Real-Time Mobile Alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-[#7C21A4] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time simulation bar */}
        <div className="my-3 p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#7C21A4] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Push Notification</span>
            </div>
            <p className="text-[10.5px] text-neutral-600 mt-0.5">
              Simulate incoming money with instant push alert &amp; chime
            </p>
          </div>

          <button
            onClick={onSimulateIncoming}
            className="px-3 py-1.5 rounded-full bg-[#7C21A4] hover:bg-[#631684] text-white text-[11px] font-bold shadow-xs active:scale-95 transition shrink-0"
          >
            +1,500 ETB
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 space-y-2 mt-1 pr-1">
          {notifications.map((item) => {
            const isCredit = item.type === 'TRANSACTION' && (item.amount || 0) > 0;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl transition flex items-start gap-3 ${
                  item.read ? 'bg-neutral-50/60' : 'bg-purple-50/40 border border-purple-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === 'TRANSACTION'
                      ? isCredit
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {item.type === 'TRANSACTION' ? (
                    isCredit ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-800 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-xs">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
