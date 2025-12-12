import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppProvider";
import { useStore } from "../../context/StoreProvider";
import UserMenu from "../../components/UserMenu";
import "./PaymentStatusPage.css";

export default function PaymentStatusPage() {
  const navigate = useNavigate();
  const { txResult } = useApp();
  const { storeSlug } = useStore();
  const [copied, setCopied] = useState(false);

  if (!txResult) {
    return (
      <>
        <UserMenu />
        <div className="page-container">
          <div className="page-card">
            <p className="error-message">No payment found</p>
            <button className="btn-secondary" onClick={() => navigate(`/${storeSlug}/catalog`)}>
              Back to Store
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleCopyTxId = async () => {
    try {
      await navigator.clipboard.writeText(txResult.txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleBackToStore = () => {
    navigate(`/${storeSlug}/catalog`);
  };

  const isSuccess = txResult.result === "SUCCESS" || txResult.result === 0;

  return (
    <>
      <UserMenu />
      <div className="page-container">
        <div className="page-card">
          <div className="page-header">
            <div className={`status-icon ${isSuccess ? "success" : "pending"}`}>
              {isSuccess ? (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              )}
            </div>
            <h1 className="page-title">Payment {isSuccess ? "Successful" : "Processing"}</h1>
            <p className="page-subtitle">
              {isSuccess
                ? "Your payment has been processed successfully"
                : "Your payment is being processed"}
            </p>
          </div>

          <div className="status-details">
            <div className="status-section">
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${isSuccess ? "success" : "pending"}`}>
                  {txResult.result}
                </span>
              </div>

              {txResult.txId && (
                <div className="txid-section">
                  <label className="detail-label">Transaction ID:</label>
                  <div className="txid-container">
                    <code className="txid">{txResult.txId}</code>
                    <button
                      className="copy-button"
                      onClick={handleCopyTxId}
                      title="Copy transaction ID"
                    >
                      {copied ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && <span className="copy-feedback">Copied!</span>}
                </div>
              )}
            </div>
          </div>

          <div className="button-group">
            <button className="btn-primary" onClick={handleBackToStore}>
              Back to Store
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
