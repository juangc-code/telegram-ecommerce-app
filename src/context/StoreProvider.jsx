import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StoreService } from '../services';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeSlug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const storeData = await StoreService.getStoreBySlug(storeSlug);
        setStore(storeData);
      } catch (err) {
        console.error('Error fetching store:', err);
        setError(err.message || 'Failed to load store');
        setStore(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [storeSlug]);

  const value = {
    store,
    storeSlug,
    isLoading,
    error,
    setStore
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
