import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppProvider";
import { useStore } from "../../context/StoreProvider";
import { lemonAuth, lemonDeposit } from "../../services/LemonService";
import { convertToCrypto } from "../../services/ConversionService";
import UserMenu from "../../components/UserMenu";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { product, amount, setTxResult } = useApp();
  const { storeSlug } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card">
            <p className="error-message">No product selected</p>
            <button className="btn-secondary" onClick={() => navigate(`/${storeSlug}/catalog`)}>
              Back to Store
            </button>
          </div>
        </div>
      </>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const auth = await lemonAuth();
      const cryptoAmount = await convertToCrypto(amount);
      const result = await lemonDeposit(cryptoAmount);

      setTxResult(result);
      navigate(`/${storeSlug}/status`);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate(`/${storeSlug}/product/${product.id}`);
  };

  const isVariablePrice = product.productType === 'VARIABLE_PRICE' || product.requiresAmount;
  const totalAmount = isVariablePrice ? amount : product.price;

  return (
    <>
      <UserMenu />
      <div className="page-container">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">Review your order</p>
          </div>

          <div className="checkout-details">
            <div className="checkout-section">
              <h3 className="section-title">Order Summary</h3>

              <div className="summary-row">
                <span className="summary-label">Product:</span>
                <span className="summary-value">{product.name}</span>
              </div>

              {product.description && (
                <div className="summary-row">
                  <span className="summary-label">Description:</span>
                  <span className="summary-value">{product.description}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Amount:</span>
                <span className="summary-value">{product.currencyCode || 'ARS'} {totalAmount}</span>
              </div>

              <div className="summary-total">
                <span className="total-label">Total:</span>
                <span className="total-value">{product.currencyCode || 'ARS'} {totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button
              className="btn-secondary"
              onClick={handleBack}
              disabled={isProcessing}
            >
              Back
            </button>
            <button
              className="btn-primary"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay with Lemon"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}