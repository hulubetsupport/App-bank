import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  LayoutGrid,
  Lock,
  Fingerprint,
  ArrowRight,
  Globe,
  Eye,
  EyeOff,
  Keyboard,
  X,
  CheckCircle2,
  ShieldCheck,
  Delete,
  Check,
} from 'lucide-react';
import { validatePassword } from '../utils/banking.ts';
import cbeLogo from '../assets/cbe-logo.png';

interface LoginScreenProps {
  onLoginSuccess: (method: 'PIN' | 'BIOMETRIC') => void;
  language: string;
  onToggleLanguage: () => void;
  correctPin: string;
  pinLength: number;
  biometricsEnabled?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  language,
  onToggleLanguage,
  correctPin,
  pinLength,
  biometricsEnabled = true,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showKeypad, setShowKeypad] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkPin = (entered: string) => {
    if (!entered) {
      setErrorMsg('Please enter your PIN.');
      return;
    }
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

  const handlePinInputChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, pinLength);
    setPin(cleaned);
    setErrorMsg('');
    if (cleaned.length === pinLength && cleaned === correctPin) {
      onLoginSuccess('PIN');
    }
  };

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    setPin((prev) => {
      if (prev.length >= pinLength) return prev;
      const nextPin = prev + digit;
      if (nextPin.length === pinLength) {
        setTimeout(() => checkPin(nextPin), 40);
      }
      return nextPin;
    });
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  useEffect(() => {
    if (showKeypad) {
      inputRef.current?.focus();
    }
  }, [showKeypad]);

  const handleBiometricAuth = () => {
    if (!biometricsEnabled) return;
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      onLoginSuccess('BIOMETRIC');
    }, 550);
  };

  const handleQuickFill = () => {
    setPin(correctPin);
    setShowQuickMenu(false);
    setTimeout(() => {
      onLoginSuccess('PIN');
    }, 150);
  };

  return (
    <div
      className="flex-1 bg-[#F5F6F8] flex flex-col justify-between px-6 phone:px-7 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-[calc(env(safe-area-inset-bottom,0px)+16px)] overflow-y-auto no-scrollbar select-none w-full h-full max-w-[500px] mx-auto relative"
      onClick={() => {
        setShowNotifications(false);
        setShowQuickMenu(false);
        if (showKeypad) setShowKeypad(false);
      }}
    >
      {/* Top Action Bar matching reference login screen */}
      <div
        className="flex items-center justify-between relative z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowQuickMenu(false);
          }}
          className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#ECEEF2] border border-[#E2E4EA] flex items-center justify-center text-[#29212E] hover:bg-[#E4E6EC] transition active:scale-95 relative"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px] phone:w-5 phone:h-5 stroke-[1.7]" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#7B1FA2]" />
        </button>

        <button
          type="button"
          onClick={onToggleLanguage}
          className="px-4 py-1.5 rounded-full bg-[#F1F2F5] border border-[#DFE1E7] text-[13px] phone:text-sm font-medium text-[#29212E] flex items-center gap-1.5 hover:bg-[#E9EBEF] transition"
        >
          <span>{language}</span>
          <span className="text-[10px] text-[#6E6A73]">▾</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowQuickMenu(!showQuickMenu);
            setShowNotifications(false);
          }}
          className="w-10 h-10 phone:w-11 phone:h-11 rounded-full bg-[#ECEEF2] border border-[#E2E4EA] flex items-center justify-center text-[#29212E] hover:bg-[#E4E6EC] transition active:scale-95"
          title="Quick Options"
          aria-label="Menu"
        >
          <LayoutGrid className="w-[18px] h-[18px] phone:w-5 phone:h-5 stroke-[1.8]" />
        </button>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute top-13 left-0 w-72 bg-white rounded-2xl border border-[#ECECEF] shadow-xl p-3.5 text-left z-40 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECECEF] mb-2">
              <span className="text-xs font-bold text-[#29212E]">CBE Alerts</span>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-[#96939A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-[#F7F7F9]">
                <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#29212E]">Mobile Banking Active</div>
                  <div className="text-[11px] text-[#96939A]">Encrypted session ready for transfer.</div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-xl bg-[#F7F7F9]">
                <ShieldCheck className="w-4 h-4 text-[#7B1FA2] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#29212E]">PIN Protection Enabled</div>
                  <div className="text-[11px] text-[#96939A]">Use {pinLength}-digit PIN or biometrics.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Menu Popover */}
        {showQuickMenu && (
          <div className="absolute top-13 right-0 w-56 bg-white rounded-2xl border border-[#ECECEF] shadow-xl p-2 text-left z-40 animate-in fade-in slide-in-from-top-2">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-[#29212E] hover:bg-[#F7F7F9] flex items-center justify-between"
            >
              <span>Quick Access Sign-In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7B1FA2]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowKeypad((k) => !k);
                setShowQuickMenu(false);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-[#29212E] hover:bg-[#F7F7F9] flex items-center justify-between"
            >
              <span>{showKeypad ? 'Hide Touch Keypad' : 'Show Touch Keypad'}</span>
              <Keyboard className="w-3.5 h-3.5 text-[#7B1FA2]" />
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLanguage();
                setShowQuickMenu(false);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-[#29212E] hover:bg-[#F7F7F9] flex items-center justify-between"
            >
              <span>Switch Language</span>
              <Globe className="w-3.5 h-3.5 text-[#D4B15C]" />
            </button>
          </div>
        )}
      </div>

      {/* Main Stationary Branding + PIN Box matching reference photos */}
      <div className="flex-1 flex flex-col items-center text-center pt-5 phone:pt-8">
        <div className="relative mb-2.5 flex items-center justify-center">
          <img
            src={cbeLogo}
            alt="Commercial Bank of Ethiopia Emblem"
            className="w-24 h-24 phone:w-28 phone:h-28 object-contain drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.src = './cbe-logo.png';
            }}
          />
        </div>

        <h1 className="text-[21px] phone:text-[23px] font-bold text-[#BA8E3C] tracking-wide">
          የኢትዮጵያ ንግድ ባንክ
        </h1>
        <h2 className="text-[11.5px] phone:text-[12.5px] font-bold tracking-[1.7px] text-[#29212E] uppercase mt-1">
          COMMERCIAL BANK OF ETHIOPIA
        </h2>

        {/* Subtle divider line matching reference */}
        <div className="h-[1px] w-44 bg-gradient-to-r from-transparent via-[#C9C6CE] to-transparent my-3.5 phone:my-4" />

        <p className="text-[15px] phone:text-[16px] text-[#5B5D66] font-normal">Welcome back</p>

        {/* Elevated Single PIN Input Card matching reference (purple active outline + lock icon) */}
        <form
          onClick={(e) => {
            e.stopPropagation();
            setShowKeypad(true);
            inputRef.current?.focus();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            checkPin(pin);
          }}
          className={`w-full max-w-[330px] phone:max-w-[360px] h-[52px] phone:h-[56px] bg-[#F5F6F8] rounded-[14px] border-[1.4px] ${
            errorMsg
              ? 'border-[#E65C57] bg-red-50/40'
              : showKeypad
              ? 'border-[#6F2C91] bg-white/70 shadow-[0_4px_16px_rgba(111,44,145,0.08)]'
              : 'border-[#6F2C91]/80 bg-white/60 shadow-[0_4px_14px_rgba(0,0,0,0.04)]'
          } px-4 flex items-center gap-3 mt-4 phone:mt-5 cursor-text ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          <Lock className="w-[18px] h-[18px] text-[#9C7022] shrink-0 stroke-[2.2]" />
          <div className="flex-1 flex items-center min-w-0 relative">
            {showKeypad && pin.length === 0 && (
              <span className="w-[1.5px] h-5 bg-[#6F2C91] animate-pulse mr-0.5 shrink-0" />
            )}
            <input
              ref={inputRef}
              type={showPin ? 'text' : 'password'}
              inputMode="none"
              autoComplete="off"
              value={pin}
              maxLength={pinLength}
              onFocus={() => setShowKeypad(true)}
              onChange={(e) => handlePinInputChange(e.target.value)}
              placeholder="PIN"
              aria-label="Enter PIN"
              className="w-full bg-transparent text-[15px] phone:text-base font-semibold text-[#29212E] placeholder-[#7A7D85] tracking-widest focus:outline-none caret-[#6F2C91] min-w-0"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {pin.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPin(!showPin);
                }}
                className="p-1 text-[#96939A] hover:text-[#29212E]"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowKeypad((k) => !k);
              }}
              className={`p-1 rounded-lg transition ${
                showKeypad ? 'text-[#7B1FA2]' : 'text-[#96939A] hover:text-[#29212E]'
              }`}
              title="Toggle numeric keypad"
              aria-label="Toggle numeric keypad"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </form>

        {errorMsg && (
          <p className="text-xs phone:text-sm text-[#E65C57] font-medium mt-2">{errorMsg}</p>
        )}

        {/* Biometrics Button (visible when keypad is dismissed, matching photo 2) */}
        {!showKeypad && biometricsEnabled && (
          <div
            className="my-auto pt-4 flex flex-col items-center animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={isBiometricScanning}
              className="w-16 h-16 phone:w-[70px] phone:h-[70px] rounded-full bg-[#741B9E] hover:opacity-95 text-white flex items-center justify-center shadow-[0_8px_22px_rgba(116,27,158,0.34)] transition active:scale-95"
              aria-label="Use Biometrics"
            >
              <Fingerprint
                className={`w-8 h-8 phone:w-9 phone:h-9 ${
                  isBiometricScanning ? 'animate-pulse text-[#E8D184]' : ''
                }`}
              />
            </button>
            <span className="text-[11px] phone:text-[11.5px] font-bold tracking-[1.4px] text-[#29212E] uppercase mt-2.5">
              {isBiometricScanning ? 'VERIFYING...' : 'USE BIOMETRICS'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Antique Gold/Bronze CTA Button when keypad is collapsed (matching photo 2) */}
      {!showKeypad && (
        <div
          className="w-full pt-2 shrink-0 animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => checkPin(pin)}
            className="w-full h-13 phone:h-14 rounded-full bg-gradient-to-r from-[#9E6A29] to-[#A7712D] hover:opacity-95 active:scale-[0.99] text-white font-semibold text-base phone:text-[17px] flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(158,106,41,0.28)] transition"
          >
            <span>Login</span>
            <ArrowRight className="w-4.5 h-4.5 stroke-[2.3]" />
          </button>
          <p className="text-[11.5px] text-[#6E7078] text-center mt-3">
            © Commercial Bank of Ethiopia
          </p>
        </div>
      )}

      {/* Custom CBE Bottom Numeric PIN Keypad Drawer matching photo 1 */}
      {showKeypad && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 z-30 bg-[#F0F1F4]/95 backdrop-blur-md rounded-t-[24px] border-t border-[#E2E4EB] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] px-4 phone:px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] animate-in slide-in-from-bottom-8 duration-200"
        >
          <div className="flex justify-center pb-3">
            <button
              type="button"
              onClick={() => setShowKeypad(false)}
              className="w-10 h-1 rounded-full bg-[#C9CCD4] hover:bg-[#AEB2BC] transition"
              aria-label="Hide PIN keypad"
              title="Minimize keypad"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 phone:gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-[52px] phone:h-[58px] rounded-[14px] bg-[#E5E7EC] hover:bg-[#DCDEE5] active:bg-[#D2D5DD] active:scale-[0.97] text-[22px] phone:text-[24px] font-normal text-[#1E1F24] flex items-center justify-center transition tabular-nums"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleDelete}
              aria-label="Backspace"
              className="h-[52px] phone:h-[58px] rounded-[14px] bg-[#E5E7EC] hover:bg-[#F5E4E6] active:scale-[0.97] flex items-center justify-center transition"
            >
              <Delete className="w-6 h-6 text-[#D94343] stroke-[1.9]" />
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-[52px] phone:h-[58px] rounded-[14px] bg-[#E5E7EC] hover:bg-[#DCDEE5] active:bg-[#D2D5DD] active:scale-[0.97] text-[22px] phone:text-[24px] font-normal text-[#1E1F24] flex items-center justify-center transition tabular-nums"
            >
              0
            </button>

            <button
              type="button"
              onClick={() => checkPin(pin)}
              aria-label="Submit PIN"
              className="h-[52px] phone:h-[58px] rounded-[14px] bg-[#E5E7EC] hover:bg-purple-100/70 active:scale-[0.97] flex items-center justify-center transition"
            >
              <Check className="w-6 h-6 text-[#7B1FA2] stroke-[2.3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

