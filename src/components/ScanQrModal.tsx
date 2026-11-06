import React, { useState } from 'react';
import { X, QrCode, Flashlight, Camera } from 'lucide-react';
import { Recipient } from '../types/index.ts';
import { INITIAL_RECIPIENTS } from '../utils/banking.ts';
import { playChime } from '../utils/audio.ts';

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
    playChime('success');
    onScanSuccess(recipient);
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col justify-between p-6 text-white animate-in fade-in duration-200">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <QrCode className="w-4 h-4 text-purple-400" />
          <span>Scan CBE QR Code</span>
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              torchOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'
            }`}
            title="Toggle Flash"
          >
            <Flashlight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Viewfinder */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative w-64 h-64 border-2 border-dashed border-purple-400/80 rounded-3xl flex items-center justify-center overflow-hidden bg-black/40">
          {/* Laser scanning beam */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 shadow-lg shadow-purple-500/80 animate-pulse"></div>

          <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-[#7C21A4]"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-[#7C21A4]"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-[#7C21A4]"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-[#7C21A4]"></div>

          <Camera className="w-12 h-12 text-white/30" />
        </div>

        <p className="text-xs text-neutral-400 mt-4 text-center max-w-[240px]">
          Align CBE QR code within frame to scan and pay instantly
        </p>
      </div>

      {/* Quick demo scan chips */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block mb-2 text-center">
          Tap QR code to test instant scanner:
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => handleSimulateScan(INITIAL_RECIPIENTS[0])}
            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition active:scale-95"
          >
            Tsegaye Abebe (7314)
          </button>
          <button
            onClick={() => handleSimulateScan(INITIAL_RECIPIENTS[2])}
            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition active:scale-95"
          >
            Bilal Seid (6157)
          </button>
        </div>
      </div>
    </div>
  );
};
