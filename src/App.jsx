import { useEffect, useState } from "react";
import Router from "./routes/Router";
import { AppProvider } from "./context/AppProvider";
import { AuthProvider } from "./context/AuthProvider";
import { retrieveRawInitData } from '@tma.js/sdk';

export default function App() {
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Check if running inside Telegram
    const isInTelegram = !!window.Telegram?.WebApp;
    setIsTelegram(isInTelegram);

    if (isInTelegram) {
      // Retrieve and refresh TMA initData
      try {
        const rawInitData = retrieveRawInitData();
        if (rawInitData) {
          // Clear old TMA data first
          localStorage.removeItem('tma');
          // Set fresh TMA data
          localStorage.setItem('tma', rawInitData);
          console.log('TMA initData refreshed:', rawInitData.substring(0, 50) + '...');
        }
      } catch (error) {
        console.log('Could not retrieve TMA initData:', error.message);
        localStorage.removeItem('tma');
      }
    } else {
      // Clear any stale TMA data when opened in browser
      localStorage.removeItem('tma');
      console.log('Running in browser, TMA auth disabled');
    }
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </AuthProvider>
  );
}
