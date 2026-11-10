import React, { useState } from 'react';
import { Bell, LayoutGrid, Lock, Fingerprint, ArrowRight, Globe } from 'lucide-react';
import { validatePassword } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.png';

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
    <div className="flex-1 bg-white flex flex-col justify-between p-6 phone:p-8 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-[calc(env(safe-area-inset-bottom,0px)+16px)] overflow-y-auto no-scrollbar select-none w-full h-full max-w-[500px] mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#F7F7F9] border border-[#ECECEF] flex items-center justify-center text-[#29212E] hover:bg-neutral-100 transition shadow-2xs"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[1.8]" />
        </button>

        <button
          onClick={onToggleLanguage}
          className="px-4 phone:px-5 py-1.5 phone:py-2 rounded-full bg-white border border-[#ECECEF] text-xs phone:text-sm font-semibold text-[#29212E] flex items-center gap-1.5 shadow-2xs hover:bg-[#F7F7F9]"
        >
          <Globe className="w-3.5 h-3.5 phone:w-4 phone:h-4 text-[#96939A]" />
          <span>{language}</span>
          <span className="text-[10px] phone:text-xs text-[#96939A]">▾</span>
        </button>

        <button
          onClick={handleQuickFill}
          className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#F7F7F9] border border-[#ECECEF] flex items-center justify-center text-[#29212E] hover:bg-neutral-100 transition shadow-2xs"
          title="Quick Login"
          aria-label="Menu"
        >
          <LayoutGrid className="w-5 h-5 phone:w-5.5 phone:h-5.5 stroke-[1.8]" />
        </button>
      </div>

      {/* Main Branding Section */}
      <div className="flex flex-col items-center text-center my-auto py-1">
        {/* CBE Golden Logo */}
        <div className="relative mb-2 phone:mb-3 flex items-center justify-center">
          <img
            src={cbeLogo}
            alt="Commercial Bank of Ethiopia Emblem"
            className="w-28 h-28 phone:w-32 phone:h-32 object-contain drop-shadow-md"
            onError={(e) => {
              e.currentTarget.src = './cbe-logo.png';
            }}
          />
        </div>

        <h1 className="text-[20px] phone:text-[23px] font-bold text-[#D4B15C] tracking-wide">
          የኢትዮጵያ ንግድ ባንክ
        </h1>
        <h2 className="text-[11px] phone:text-[12.5px] font-bold tracking-[1.5px] text-[#29212E] uppercase mt-0.5">
          Commercial Bank of Ethiopia
        </h2>

        <p className="text-sm phone:text-base text-[#96939A] mt-5 phone:mt-6 font-medium">Welcome back</p>

        {/* PIN Display Card */}
        <div
          className={`w-full max-w-[290px] phone:max-w-[340px] h-13 phone:h-15 bg-white rounded-2xl phone:rounded-3xl border ${
            errorMsg ? 'border-[#E65C57] bg-red-50/40' : 'border-[#ECECEF]'
          } shadow-xs px-4 phone:px-5 flex items-center gap-3 mt-4 phone:mt-5 transition-all ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          <Lock className="w-5 h-5 phone:w-6 phone:h-6 text-[#D4B15C] shrink-0" />
          <div className="flex-1 flex items-center justify-center gap-3 text-center">
            {pin ? (
              <div className="flex items-center gap-2.5 phone:gap-3.5">
                {Array.from({ length: pinLength }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3.5 h-3.5 phone:w-4 phone:h-4 rounded-full transition-all ${
                      idx < pin.length ? 'bg-[#7B1FA2] scale-110 shadow-xs' : 'border-2 border-neutral-300'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[#96939A] text-sm phone:text-base font-medium tracking-wide">
                PIN
              </span>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs phone:text-sm text-[#E65C57] font-medium mt-1.5 animate-in fade-in">
            {errorMsg}
          </p>
        )}

        {/* Biometrics Button */}
        <div className="mt-5 phone:mt-6 flex flex-col items-center">
          <button
            onClick={handleBiometricAuth}
            disabled={isBiometricScanning}
            className="w-15 h-15 phone:w-18 phone:h-18 rounded-full bg-gradient-to-br from-[#76169B] to-[#941FAE] hover:opacity-90 text-white flex items-center justify-center shadow-lg shadow-purple-900/25 transition active:scale-95"
            aria-label="Use Biometrics"
          >
            <Fingerprint
              className={`w-8 h-8 phone:w-9.5 phone:h-9.5 ${isBiometricScanning ? 'animate-pulse text-[#E8D184]' : ''}`}
            />
          </button>
          <span className="text-[10px] phone:text-[11.5px] font-bold tracking-widest text-[#29212E] uppercase mt-2">
            {isBiometricScanning ? 'Verifying...' : 'USE BIOMETRICS'}
          </span>
        </div>

        {/* Numeric Keypad */}
        <div className="w-full max-w-[280px] phone:max-w-[340px] grid grid-cols-3 gap-2 phone:gap-3 mt-4 phone:mt-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-10.5 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-neutral-100 active:bg-neutral-200 text-base phone:text-lg font-semibold text-[#29212E] transition flex items-center justify-center border border-[#ECECEF]"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-10.5 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-red-50 text-xs phone:text-sm font-bold text-[#E65C57] transition flex items-center justify-center uppercase border border-[#ECECEF] active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-10.5 phone:h-13 rounded-xl phone:rounded-2xl bg-[#F7F7F9] hover:bg-neutral-100 active:bg-neutral-200 text-base phone:text-lg font-semibold text-[#29212E] transition flex items-center justify-center border border-[#ECECEF]"
          >
            0
          </button>
          <button
            onClick={() => checkPin(pin)}
            className="h-10.5 phone:h-13 rounded-xl phone:rounded-2xl bg-purple-50 hover:bg-purple-100 text-xs phone:text-sm font-bold text-[#7B1FA2] transition flex items-center justify-center border border-purple-200 active:scale-95"
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
          className="w-full h-12 phone:h-14 rounded-full bg-gradient-to-r from-[#D4B15C] to-[#E8D184] hover:opacity-95 active:scale-[0.99] text-[#29212E] font-bold text-base phone:text-lg flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 transition"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4 phone:w-5 phone:h-5 stroke-[2.4]" />
        </button>
        <p className="text-[11px] phone:text-xs text-[#96939A] text-center mt-2.5">
          © Commercial Bank of Ethiopia
        </p>
      </div>
    </div>
  );
};
