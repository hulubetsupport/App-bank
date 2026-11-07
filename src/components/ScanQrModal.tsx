import React, { useState } from 'react';
import { X, QrCode, Flashlight, Camera } from 'lucide-react';
import { Recipient } from '../types/index.ts';
import { INITIAL_RECIPIENTS } from '../utils/banking.ts';

interface ScanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (recipient: Recipient) => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (recipient: Recipient) => {
    onScanSuccess(recipient);
  };

  return (
    <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-6 phone:p-8 text-white animate-in fade-in duration-200 select-none max-w-[500px] mx-auto w-full">
      {/* Top Action Row */}
      <div className="flex items-center justify-between pt-[calc(env(safe-area-inset-top,0px)+6px)]">
        <h3 className="text-sm phone:text-base font-bold flex items-center gap-2">
          <QrCode className="w-4.5 h-4.5 phone:w-5 phone:h-5 text-purple-300" />
          <span>Scan CBE QR Code</span>
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-9 h-9 phone:w-10 phone:h-10 rounded-full flex items-center justify-center transition ${
              torchOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'
            }`}
            title="Toggle Flash"
          >
            <Flashlight className="w-4 h-4 phone:w-5 phone:h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5 phone:w-5.5 phone:h-5.5" />
          </button>
        </div>
      </div>

      {/* Center Viewfinder */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative w-64 h-64 phone:w-72 phone:h-72 border-2 border-dashed border-purple-400/60 rounded-3xl flex items-center justify-center overflow-hidden bg-black/40 shadow-2xl">
          {/* Laser Scanning Beam */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 shadow-lg shadow-purple-500/80 animate-pulse"></div>

          <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-[#7B1FA2]"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-[#7B1FA2]"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-[#7B1FA2]"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-[#7B1FA2]"></div>

          <Camera className="w-12 h-12 phone:w-14 phone:h-14 text-white/30" />
        </div>

        <p className="text-xs phone:text-sm text-neutral-400 mt-4 phone:mt-5 text-center max-w-[260px]">
          Align CBE QR code within frame to scan and pay instantly
        </p>
      </div>

      {/* Quick Demo Scan Chips */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 pb-[calc(env(safe-area-inset-bottom,0px)+14px)]">
        <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider block mb-2 text-center">
          Tap QR code to test instant scanner:
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => handleSimulateScan(INITIAL_RECIPIENTS[0])}
            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition active:scale-95"
          >
            {INITIAL_RECIPIENTS[0]?.name || 'Sara Endris'}
          </button>
          {INITIAL_RECIPIENTS[1] && (
            <button
              onClick={() => handleSimulateScan(INITIAL_RECIPIENTS[1])}
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition active:scale-95"
            >
              {INITIAL_RECIPIENTS[1].name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
