import type { ChangeEvent, FormEvent } from "react";

import type { PaymentFormData } from "./payment.types";

interface CardPaymentFormProps {
  formData: PaymentFormData;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CardPaymentForm = ({ formData, onChange, onBack, onSubmit }: CardPaymentFormProps) => (
  <form className="payment-form" onSubmit={onSubmit}>
    <div className="form-header">
      <button type="button" className="btn-back-method" onClick={onBack}>
        ← Back to Methods
      </button>
      <h3>Card Payment Details</h3>
    </div>

    <div className="card-form-container">
      <div className="card-display">
        <div className="card-chip">💳</div>
        <div className="card-number">
          {formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, "*") : "**** **** **** ****"}
        </div>
        <div className="card-details">
          <div className="card-holder">
            <span className="label">CARDHOLDER NAME</span>
            <span className="value">{formData.cardHolder || "YOUR NAME"}</span>
          </div>
          <div className="card-expiry">
            <span className="label">EXPIRES</span>
            <span className="value">{formData.expiryDate || "MM/YY"}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number *</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={onChange}
          placeholder="1234 5678 9012 3456"
          maxLength={16}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cardHolder">Cardholder Name *</label>
        <input
          type="text"
          id="cardHolder"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={onChange}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date *</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={onChange}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV *</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={onChange}
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount (Rs) *</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={onChange}
          placeholder="1500"
          disabled
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-submit">
          Pay Rs {formData.amount}
        </button>
        <button type="button" className="btn btn-cancel" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>
  </form>
);

export default CardPaymentForm;

