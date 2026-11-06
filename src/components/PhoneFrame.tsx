import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';
import { ScreenType } from '../types/index.ts';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenType;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, activeScreen }) => {
  const isPurpleScreen = activeScreen !== 'login';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start md:justify-center p-0 md:p-4 select-none">
      {/* Smartphone Shell with authentic bezel and waterdrop camera notch */}
      <div className="relative w-full max-w-[412px] h-[100dvh] md:h-[868px] bg-[#F5F3EC] md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col border-0 md:border-[10px] md:border-[#1e1e1e]">
        {/* Native Android Status Bar */}
        <div
          className={`w-full h-8 px-6 pt-1.5 flex items-center justify-between z-40 select-none text-[12.5px] font-semibold transition-colors ${
            isPurpleScreen ? 'bg-[#7C21A4] text-white' : 'bg-white text-neutral-800'
          }`}
        >
          {/* Time & notification icons */}
          <div className="flex items-center gap-1.5 font-medium tracking-tight">
            <span>22:52</span>
            {isPurpleScreen && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
            )}
          </div>

          {/* Waterdrop Camera Notch */}
          <div className="w-4 h-4 rounded-full bg-black/90 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#151c2c]"></div>
          </div>

          {/* Signal, WiFi, Battery */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold">4G+</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold">20%</span>
              <Battery className={`w-3.5 h-3.5 ${isPurpleScreen ? 'fill-white' : 'fill-neutral-800'}`} />
            </div>
          </div>
        </div>

        {/* Dynamic screen content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Android bottom gesture pill */}
        <div className="w-full h-4 bg-[#F5F3EC] flex items-center justify-center py-1 select-none shrink-0">
          <div className="w-28 h-1 rounded-full bg-neutral-400"></div>
        </div>
      </div>
    </div>
  );
};
