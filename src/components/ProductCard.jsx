import React from 'react';
import './ProductCard.css';

/**
 * ProductCard
 * Props:
 *  - product: { id, name, description, price, suggested_local, requiresAmount, imageUrl }
 *  - onSelect: function
 */
export default function ProductCard({ product, onSelect }) {
  return (
    <div
      className="product-card"
      onClick={() => onSelect?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect?.(product); }}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      ) : (
        <div className="product-image-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      )}

      <div className="product-info">
        <div className="product-header">
          <div>
            <div className="product-name">{product.name}</div>
            {product.description && <div className="product-description">{product.description}</div>}
          </div>

          <div className="product-price-container">
            {product.productType === 'VARIABLE_PRICE' || product.requiresAmount ? (
              <>
                <div className="product-price">Choose your price</div>
                {product.suggestedPrice && (
                  <div className="product-custom">Suggested: {product.currencyCode || 'ARS'} {product.suggestedPrice}</div>
                )}
              </>
            ) : typeof product.price !== 'undefined' ? (
              <div className="product-price">{product.currencyCode || 'ARS'} {product.price}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
