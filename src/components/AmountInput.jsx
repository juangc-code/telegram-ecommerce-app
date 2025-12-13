import React from 'react';
import './AmountInput.css';

/**
 * AmountInput
 * Props:
 *  - value: number|string
 *  - onChange: function(newValue)
 *  - placeholder: string
 *  - min: number
 */
export default function AmountInput({ value = '', onChange, placeholder = '$', min = 0 }) {
  const handleChange = (e) => {
    // keep value as string to allow user typing decimals etc.
    const v = e.target.value;
    // allow only numbers and one dot
    if (v === '' || /^(\d+(\.\d{0,8})?|\.?\d{1,8})$/.test(v)) {
      onChange?.(v);
    }
  };

  return (
    <div className="amount-input-container">
      <label htmlFor="amount-input" className="amount-label">
        Amount (ARS)
      </label>
      <div className="amount-input-wrapper">
        {/* <span className="amount-currency">$</span> */}
        <input
          id="amount-input"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="amount-input"
          aria-label="amount"
        />
      </div>
      <div className="amount-hint">
        You can enter decimals. Example: 1500.50
      </div>
    </div>
  );
}
