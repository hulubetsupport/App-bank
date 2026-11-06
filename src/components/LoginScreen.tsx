import React, { useState } from 'react';
import { Bell, LayoutGrid, Lock, Fingerprint, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { validatePassword, DEFAULT_AUTH_PIN } from '../utils/banking.ts';
import { playChime } from '../utils/audio.ts';

interface LoginScreenProps {
  onLoginSuccess: (method: 'PIN' | 'BIOMETRIC') => void;
  onOpenNotifications: () => void;
  language: string;
  onToggleLanguage: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onOpenNotifications,
  language,
  onToggleLanguage,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  const handleKeyPress = (digit: string) => {
    playChime('tap');
    setErrorMsg('');
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        checkPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    playChime('tap');
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const checkPin = (entered: string) => {
    if (validatePassword(entered, DEFAULT_AUTH_PIN)) {
      playChime('success');
      onLoginSuccess('PIN');
    } else {
      playChime('error');
      setIsShaking(true);
      setErrorMsg('Incorrect PIN. Real password is: 0607');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    playChime('tap');
    setTimeout(() => {
      setIsBiometricScanning(false);
      playChime('success');
      onLoginSuccess('BIOMETRIC');
    }, 900);
  };

  const handleQuickFill = () => {
    setPin(DEFAULT_AUTH_PIN);
    playChime('tap');
    setTimeout(() => {
      playChime('success');
      onLoginSuccess('PIN');
    }, 200);
  };

  return (
    <div className="flex-1 bg-white flex flex-col justify-between p-6 overflow-y-auto">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleLanguage}
          className="px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 shadow-xs hover:bg-neutral-50"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
          <span>{language}</span>
          <span className="text-[10px] text-neutral-400">▾</span>
        </button>

        <button
          onClick={handleQuickFill}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition"
          title="Quick Login (0607)"
          aria-label="Quick login"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>

      {/* Main branding & pin section */}
      <div className="flex flex-col items-center text-center my-auto py-2">
        {/* CBE Golden Logo */}
        <div className="relative mb-3">
          <img
            src="https://i.postimg.cc/Hk1pN2VS/20260805-174301.png"
            alt="Commercial Bank of Ethiopia Emblem"
            className="w-24 h-24 object-contain drop-shadow-md"
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
          className={`w-full max-w-[300px] h-14 bg-white rounded-2xl border ${
            errorMsg ? 'border-red-400 bg-red-50/40' : 'border-neutral-200'
          } shadow-sm px-4 flex items-center gap-3 mt-4 transition-all ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          <Lock className="w-5 h-5 text-[#b58d4e] shrink-0" />
          <div className="flex-1 flex items-center justify-center gap-4 text-center">
            {pin ? (
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <span
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
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
          <p className="text-xs text-red-600 font-medium mt-2 animate-in fade-in">
            {errorMsg}
          </p>
        )}

        {/* Quick credential indicator */}
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 text-[11px] text-amber-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Real Password: <strong className="font-mono">0607</strong></span>
          <button
            onClick={handleQuickFill}
            className="ml-1 text-[10px] font-bold underline text-[#7C21A4]"
          >
            Auto-fill
          </button>
        </div>

        {/* Biometrics button */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleBiometricAuth}
            disabled={isBiometricScanning}
            className="w-16 h-16 rounded-full bg-[#7C21A4] hover:bg-[#68198a] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition active:scale-95"
            aria-label="Use Biometrics"
          >
            <Fingerprint
              className={`w-8 h-8 ${isBiometricScanning ? 'animate-pulse text-amber-300' : ''}`}
            />
          </button>
          <span className="text-[10px] font-bold tracking-widest text-neutral-700 uppercase mt-2">
            {isBiometricScanning ? 'Verifying fingerprint...' : 'USE BIOMETRICS'}
          </span>
        </div>

        {/* Compact Keypad */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 mt-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-600 transition flex items-center justify-center uppercase"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-base font-semibold text-neutral-800 transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => checkPin(pin)}
            className="h-11 rounded-xl bg-purple-100 hover:bg-purple-200 text-xs font-bold text-purple-900 transition flex items-center justify-center"
          >
            Enter
          </button>
        </div>
      </div>

      {/* Login Button & Copyright */}
      <div className="w-full mt-2">
        <button
          onClick={() => {
            if (pin) checkPin(pin);
            else handleQuickFill();
          }}
          className="w-full h-13 rounded-full bg-[#b58d4e] hover:bg-[#a27c3f] active:scale-[0.99] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 transition"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-neutral-400 text-center mt-3">
          © Commercial Bank of Ethiopia
        </p>
      </div>
    </div>
  );
};
