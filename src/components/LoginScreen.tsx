import React, { useState } from 'react';
import { Bell, LayoutGrid, Lock, Fingerprint, ArrowRight, Globe } from 'lucide-react';
import { validatePassword, OFFICIAL_CBE_LOGO } from '../utils/banking.ts';

interface LoginScreenProps {
  onLoginSuccess: (method: 'PIN' | 'BIOMETRIC') => void;
  language: string;
  onToggleLanguage: () => void;
  correctPin: string;
  pinLength: number;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  language,
  onToggleLanguage,
  correctPin,
  pinLength,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    if (pin.length < pinLength) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === pinLength) {
        checkPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const checkPin = (entered: string) => {
    if (validatePassword(entered, correctPin)) {
      onLoginSuccess('PIN');
    } else {
      setIsShaking(true);
      setErrorMsg('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 600);
    }
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      onLoginSuccess('BIOMETRIC');
    }, 600);
  };

  const handleQuickFill = () => {
    setPin(correctPin);
    setTimeout(() => {
      onLoginSuccess('PIN');
    }, 150);
  };

  return (
    <div className="flex-1 bg-white flex flex-col justify-between p-6 overflow-y-auto select-none">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleLanguage}
          className="px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 shadow-2xs hover:bg-neutral-50"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
          <span>{language}</span>
          <span className="text-[10px] text-neutral-400">▾</span>
        </button>

        <button
          onClick={handleQuickFill}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition"
          title="Quick Login"
          aria-label="Menu"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>

      {/* Main Branding Section */}
      <div className="flex flex-col items-center text-center my-auto py-1">
        {/* CBE Golden Logo */}
        <div className="relative mb-3">
          <img
            src={OFFICIAL_CBE_LOGO}
            alt="Commercial Bank of Ethiopia Emblem"
            className="w-24 h-24 object-contain drop-shadow-sm"
          />
        </div>

        <h1 className="text-xl font-bold text-[#b58d4e] tracking-wide font-serif">
          የኢትዮጵያ ንግድ ባንክ
        </h1>
        <h2 className="text-[11px] font-bold tracking-[1.5px] text-neutral-700 uppercase mt-0.5">
          Commercial Bank of Ethiopia
        </h2>

        <p className="text-sm text-neutral-500 mt-5 font-medium">Welcome back</p>

        {/* PIN display card */}
        <div
          className={`w-full max-w-[290px] h-13 bg-white rounded-2xl border ${
            errorMsg ? 'border-red-400 bg-red-50/40' : 'border-neutral-200'
          } shadow-xs px-4 flex items-center gap-3 mt-4 transition-all ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          <Lock className="w-5 h-5 text-[#b58d4e] shrink-0" />
          <div className="flex-1 flex items-center justify-center gap-3 text-center">
            {pin ? (
              <div className="flex items-center gap-2.5">
                {Array.from({ length: pinLength }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx < pin.length ? 'bg-[#7C21A4] scale-110' : 'border-2 border-neutral-300'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-neutral-400 text-sm font-medium tracking-wide">
                PIN
              </span>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 font-medium mt-1.5 animate-in fade-in">
            {errorMsg}
          </p>
        )}

        {/* Biometrics button */}
        <div className="mt-5 flex flex-col items-center">
          <button
            onClick={handleBiometricAuth}
            disabled={isBiometricScanning}
            className="w-15 h-15 rounded-full bg-[#7C21A4] hover:bg-[#68198a] text-white flex items-center justify-center shadow-lg shadow-purple-500/25 transition active:scale-95"
            aria-label="Use Biometrics"
          >
            <Fingerprint
              className={`w-7.5 h-7.5 ${isBiometricScanning ? 'animate-pulse text-amber-300' : ''}`}
            />
          </button>
          <span className="text-[10px] font-bold tracking-widest text-neutral-700 uppercase mt-2">
            {isBiometricScanning ? 'Verifying...' : 'USE BIOMETRICS'}
          </span>
        </div>

        {/* Numeric Keypad */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 mt-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-10.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-10.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-600 transition flex items-center justify-center uppercase"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-10.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => checkPin(pin)}
            className="h-10.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-xs font-bold text-purple-900 transition flex items-center justify-center"
          >
            Enter
          </button>
        </div>
      </div>

      {/* Login Button & Copyright */}
      <div className="w-full mt-1">
        <button
          onClick={() => {
            if (pin) checkPin(pin);
            else handleQuickFill();
          }}
          className="w-full h-12.5 rounded-full bg-[#b58d4e] hover:bg-[#a27c3f] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 transition"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-neutral-400 text-center mt-2.5">
          © Commercial Bank of Ethiopia
        </p>
      </div>
    </div>
  );
};
