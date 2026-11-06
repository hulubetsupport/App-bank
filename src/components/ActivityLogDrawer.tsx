import React, { useState } from 'react';
import {
  X,
  History,
  ShieldCheck,
  Smartphone,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { ActivityLog } from '../types/index.ts';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory === 'ALL') return true;
    return log.category === selectedCategory;
  });

  const handleExportCSV = () => {
    const header = 'ID,Timestamp,Action,Category,Status,Details,IP,Device\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.action}","${l.category}","${l.status}","${l.details.replace(
            /"/g,
            '""'
          )}","${l.ipAddress}","${l.device}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbe-activity-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] max-h-[85%] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">
                Detailed Activity Tracking
              </h3>
              <p className="text-[10px] text-neutral-400">Security &amp; Audit Trail</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold flex items-center gap-1 transition"
              title="Export CSV"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar text-[11px] font-bold">
          {['ALL', 'AUTH', 'TRANSACTION', 'SECURITY', 'SETTINGS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#7C21A4] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-2 mt-2">
          {filteredLogs.map((log) => {
            const isSuccess = log.status === 'SUCCESS';
            const isFailed = log.status === 'FAILED';
            return (
              <div key={log.id} className="pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isFailed ? (
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="font-bold text-neutral-800">{log.action}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-500 font-mono font-semibold">
                      {log.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 mt-1 pl-5">{log.details}</p>

                <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono mt-1 pl-5">
                  <span>IP: {log.ipAddress}</span>
                  <span>•</span>
                  <span>{log.device}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
