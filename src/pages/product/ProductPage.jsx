import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppProvider";
import { useStore } from "../../context/StoreProvider";
import AmountInput from "../../components/AmountInput";
import UserMenu from "../../components/UserMenu";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, amount, setAmount } = useApp();
  const { storeSlug } = useStore();

  if (!product) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card">
            <p className="error-message">Product not found</p>
            <button className="btn-secondary" onClick={() => navigate(`/${storeSlug}/catalog`)}>
              Back to Store
            </button>
          </div>
        </div>
      </>
    );
  }

  const isVariablePrice = selected.productType === 'VARIABLE_PRICE' || selected.requiresAmount;
  const minPrice = selected.minPrice || 0;

  const handleContinue = () => {
    if (isVariablePrice) {
      const amountValue = Number(amount);
      if (!amount || amountValue <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (minPrice > 0 && amountValue < minPrice) {
        alert(`Minimum amount is ${selected.currencyCode || 'ARS'} ${minPrice}`);
        return;
      }
    }
    navigate(`/${storeSlug}/checkout`);
  };

  const handleBack = () => {
    navigate(`/${storeSlug}/catalog`);
  };

  return (
    <>
      <UserMenu />
      <div className="page-container">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">{selected.name}</h1>
            <p className="page-subtitle">{selected.description}</p>
          </div>

          <div className="product-details">
            {typeof selected.price !== 'undefined' && !isVariablePrice && (
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value">{selected.currencyCode || 'ARS'} {selected.price}</span>
              </div>
            )}

            {isVariablePrice && (
              <div className="amount-section">
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  min={minPrice}
                  placeholder={selected.suggestedPrice ? `Suggested: ${selected.suggestedPrice}` : '$'}
                />
                {minPrice > 0 && (
                  <p className="price-hint">Minimum: {selected.currencyCode || 'ARS'} {minPrice}</p>
                )}
                {selected.suggestedPrice && (
                  <p className="price-hint">Suggested: {selected.currencyCode || 'ARS'} {selected.suggestedPrice}</p>
                )}
              </div>
            )}
          </div>

          <div className="button-group">
            <button className="btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button className="btn-primary" onClick={handleContinue}>
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
