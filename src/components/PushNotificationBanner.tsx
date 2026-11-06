import React, { useEffect } from 'react';
import { NotificationItem } from '../types/index.ts';
import { ArrowUpRight, ArrowDownLeft, ShieldAlert, X } from 'lucide-react';

interface PushNotificationBannerProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onOpenDetails: (notif: NotificationItem) => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  notification,
  onDismiss,
  onOpenDetails,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className="absolute top-9 left-3 right-3 z-50 animate-in slide-in-from-top-6 duration-300">
      <div
        onClick={() => onOpenDetails(notification)}
        className="w-full bg-neutral-900/95 text-white backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-neutral-700/80 cursor-pointer transition hover:bg-neutral-800"
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center shrink-0 shadow-md">
              {notification.type === 'TRANSACTION' ? (
                notification.amount && notification.amount > 0 ? (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-300" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-300" />
                )
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-300" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                  CBE Mobile Alert
                </span>
                <span className="text-[10px] text-neutral-400">Just now</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate mt-0.5">
                {notification.title}
              </h4>
              <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 leading-tight">
                {notification.message}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-full transition shrink-0"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
