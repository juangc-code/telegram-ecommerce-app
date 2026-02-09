import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import TenantService from '../../services/TenantService';
import StoreCard from '../../components/StoreCard';
import './SubscribedStoresPage.css';

const SubscribedStoresPage = () => {
  const navigate = useNavigate();
  const { user, getCurrentUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStores = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user if not available
        let currentUser = user;
        if (!currentUser) {
          currentUser = await getCurrentUser();
        }

        if (!currentUser || !currentUser.username) {
          setError('User information not available');
          setIsLoading(false);
          return;
        }

        // Fetch all users with the same username (same user, different tenants)
        // This assumes the backend has an endpoint to get users by username
        // For now, we'll use the user's tenantId to get tenant info
        if (currentUser.tenantId) {
          const tenantData = await TenantService.getTenantById(currentUser.tenantId);

          if (tenantData && tenantData.pathSlug) {
            setStores([{
              tenantId: currentUser.tenantId,
              name: tenantData.name || 'Store',
              description: tenantData.description,
              logoUrl: tenantData.logoUrl,
              pathSlug: tenantData.pathSlug
            }]);
          }
        }
      } catch (err) {
        console.error('Error fetching user stores:', err);
        setError('Failed to load your stores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStores();
  }, [user, getCurrentUser]);

  const handleStoreClick = (store) => {
    if (store.pathSlug) {
      navigate(`/${store.pathSlug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-card">
          <div className="loading-container">
            <p>Loading your stores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-card">
          <div className="error-container">
            <h1 className="page-title">Error</h1>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container subscribed-stores-container">
      <div className="page-card subscribed-stores-card">
        <div className="subscribed-stores-hero">
          <h1 className="subscribed-stores-title">My Stores</h1>
          <p className="subscribed-stores-subtitle">
            Select a store to browse products and make purchases
          </p>
        </div>

        {stores.length === 0 ? (
          <div className="no-stores-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <p>You are not subscribed to any stores yet.</p>
          </div>
        ) : (
          <div className="stores-grid">
            {stores.map((store) => (
              <StoreCard
                key={store.tenantId}
                store={store}
                onClick={handleStoreClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribedStoresPage;
