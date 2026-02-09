import { useEffect } from "react";
import Router from "./routes/Router";
import { AppProvider } from "./context/AppProvider";
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
  useEffect(() => {
    // Check if running inside Telegram
    const isInTelegram = !!window.Telegram?.WebApp;
    console.log('Is Telegram:', isInTelegram);

    if (isInTelegram) {
      // Retrieve and refresh TMA initData
      try {
        // Import and use the function dynamically
        import('@tma.js/sdk').then(({ retrieveRawInitData }) => {
          try {
            const rawInitData = retrieveRawInitData();
            console.log('Raw initData retrieved:', !!rawInitData);
            if (rawInitData) {
              // Clear old TMA data first
              localStorage.removeItem('tma');
              // Set fresh TMA data
              localStorage.setItem('tma', rawInitData);
              console.log('TMA initData stored in localStorage');
              console.log('TMA preview:', rawInitData.substring(0, 50) + '...');
              // Verify it was stored
              const stored = localStorage.getItem('tma');
              console.log('TMA verified in storage:', !!stored);
            } else {
              console.log('No rawInitData returned');
            }
          } catch (innerError) {
            console.error('Error retrieving TMA initData:', innerError);
            localStorage.removeItem('tma');
          }
        }).catch(err => {
          console.error('Error importing @tma.js/sdk:', err);
        });
      } catch (error) {
        console.error('Could not retrieve TMA initData:', error);
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
