import { useEffect } from "react";
import Router from "./routes/Router";
import { AppProvider } from "./context/AppProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useRawInitData } from '@tma.js/sdk-react';

export default function App() {
  const rawInitData = useRawInitData();

  useEffect(() => {
    // Refresh TMA initData whenever the app mounts/reopens
    if (window.Telegram?.WebApp && rawInitData) {
      localStorage.setItem('tma', rawInitData);
      console.log('TMA initData refreshed');
    }
  }, [rawInitData]);

  return (
    <AuthProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </AuthProvider>
  );
}
