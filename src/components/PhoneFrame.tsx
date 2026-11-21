import React, { useEffect } from 'react';
import { ScreenType } from '../types/index.ts';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenType;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, activeScreen }) => {
  useEffect(() => {
    // Configure real native Android status bar with @capacitor/status-bar
    // Note: Style.Dark = light/white icons for dark/purple backgrounds; Style.Light = dark icons for light backgrounds.
    if (Capacitor.isNativePlatform()) {
      const isPurpleScreen = activeScreen !== 'login';
      StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
      StatusBar.setBackgroundColor({ color: isPurpleScreen ? '#7B1FA2' : '#F5F6F8' }).catch(() => {});
      StatusBar.setStyle({ style: isPurpleScreen ? Style.Dark : Style.Light }).catch(() => {});
    }
  }, [activeScreen]);

  return (
    <main className="w-screen h-[100dvh] bg-[#F7F7F9] flex flex-col overflow-hidden relative m-0 p-0">
      {children}
    </main>
  );
};
