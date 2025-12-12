import { useParams, useNavigate } from "react-router-dom";
import products from "../../data/products";
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

  const selected = product ?? products.find(p => p.id === id);

  if (!selected) {
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

  const handleContinue = () => {
    if (selected.requiresAmount && (!amount || Number(amount) <= 0)) {
      alert("Please enter a valid amount");
      return;
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
            {typeof selected.price !== 'undefined' && !selected.requiresAmount && (
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${selected.price}</span>
              </div>
            )}

            {selected.requiresAmount && (
              <div className="amount-section">
                <AmountInput value={amount} onChange={setAmount} />
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
