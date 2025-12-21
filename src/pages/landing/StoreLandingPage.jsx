import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreProvider';
import { useRawInitData } from '@tma.js/sdk-react';
import './StoreLandingPage.css';

const StoreLandingPage = () => {
  const navigate = useNavigate();
  localStorage.setItem('tma', useRawInitData());
  const { store, isLoading, error, storeSlug } = useStore();
  localStorage.setItem('store', storeSlug);  

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-card">
          <div className="loading-container">
            <p>Loading store...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="page-container">
        <div className="page-card">
          <div className="error-container">
            <h1 className="page-title">Store Not Found</h1>
            <p className="error-message">
              {error || 'The store you are looking for does not exist.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleViewCatalog = () => {
    navigate(`/${storeSlug}/catalog`);
  };

  return (
    <div className="page-container landing-container">
      <div className="page-card landing-card">
        <div className="store-hero">
          {store.data.logoUrl && (
            <div className="store-logo">
              <img src={store.data.logoUrl} alt={`${store.data.name} logo`} />
            </div>
          )}
          <h1 className="store-name">{store.data.name}</h1>
          {store.description && (
            <p className="store-description">{store.data.description}</p>
          )}
        </div>

        <div className="landing-actions">
          <button
            className="btn-primary btn-catalog"
            onClick={handleViewCatalog}
          >
            View Product Catalog
          </button>
        </div>

        {store.data.businessAddress && (
          <div className="store-info">
            <p className="store-info-label">Location</p>
            <p className="store-info-value">{store.businessAddress}</p>
          </div>
        )}

        {store.data.contactEmail && (
          <div className="store-info">
            <p className="store-info-label">Contact</p>
            <p className="store-info-value">{store.data.contactEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreLandingPage;
