import { useEffect, useState } from "react";
import Router from "./routes/Router";
import { AppProvider } from "./context/AppProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useRawInitData } from '@tma.js/sdk-react';

export default function App() {
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Check if running inside Telegram
    const isInTelegram = !!window.Telegram?.WebApp;
    setIsTelegram(isInTelegram);

    if (!isInTelegram) {
      // Clear any stale TMA data when opened in browser
      localStorage.removeItem('tma');
    }
  }, []);

  // Only call useRawInitData hook if we're in Telegram environment
  const rawInitData = isTelegram ? useRawInitData() : null;

  useEffect(() => {
    // Only handle TMA data if we're in Telegram environment
    if (isTelegram) {
      if (rawInitData) {
        // Clear old TMA data first
        localStorage.removeItem('tma');
        // Set fresh TMA data
        localStorage.setItem('tma', rawInitData);
        console.log('TMA initData refreshed:', rawInitData.substring(0, 50) + '...');
      } else {
        // If no rawInitData available, clear stale data
        localStorage.removeItem('tma');
        console.log('No TMA initData available, cleared stale data');
      }
    }
  }, [isTelegram, rawInitData]);

  return (
    <AuthProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </AuthProvider>
  );
}
