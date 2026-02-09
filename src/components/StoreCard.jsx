import React from 'react';
import './StoreCard.css';

/**
 * StoreCard
 * Props:
 *  - store: { name, description, logoUrl, pathSlug }
 *  - onClick: function
 */
export default function StoreCard({ store, onClick }) {
  return (
    <div
      className="store-card"
      onClick={() => onClick?.(store)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(store); }}
    >
      {store.logoUrl ? (
        <img
          src={store.logoUrl}
          alt={store.name}
          className="store-card-image"
        />
      ) : (
        <div className="store-card-image-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      )}

      <div className="store-card-info">
        <div className="store-card-header">
          <div>
            <div className="store-card-name">{store.name}</div>
            {store.description && <div className="store-card-description">{store.description}</div>}
          </div>

          <div className="store-card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
