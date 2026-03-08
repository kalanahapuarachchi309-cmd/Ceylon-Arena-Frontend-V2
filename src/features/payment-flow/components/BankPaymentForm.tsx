import type { ChangeEvent, FormEvent } from "react";

import type { PaymentFormData } from "./payment.types";

interface BankPaymentFormProps {
  formData: PaymentFormData;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const BankPaymentForm = ({
  formData,
  onInputChange,
  onFileChange,
  onBack,
  onSubmit,
}: BankPaymentFormProps) => (
  <form className="payment-form" onSubmit={onSubmit}>
    <div className="form-header">
      <button type="button" className="btn-back-method" onClick={onBack}>
        ← Back to Methods
      </button>
      <h3>Bank Transfer Details</h3>
    </div>

    <div className="bank-transfer-container">
      <div className="bank-info-box">
        <h4>Bank Account Details</h4>
        <div className="info-item">
          <span>Account Holder:</span>
          <strong>Symphony Event LK</strong>
        </div>
        <div className="info-item">
          <span>Account Number:</span>
          <strong>8023860717</strong>
        </div>
        <div className="info-item">
          <span>Bank Name:</span>
          <strong>Commercial Bank</strong>
        </div>
        <div className="info-item">
          <span>Branch:</span>
          <strong>Anuradhapura</strong>
        </div>
        <div className="info-item">
          <span>Amount:</span>
          <strong>Rs 1,500</strong>
        </div>
      </div>

      <hr className="divider" />

      <div className="bank-form-fields">
        <div className="form-group">
          <label htmlFor="bankName">Your Bank Name *</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={onInputChange}
            placeholder="Enter your bank name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountHolder">Account Holder Name *</label>
          <input
            type="text"
            id="accountHolder"
            name="accountHolder"
            value={formData.accountHolder}
            onChange={onInputChange}
            placeholder="Enter your account holder name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountNumber">Account Number *</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={onInputChange}
            placeholder="Enter your account number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slipFile">Upload Payment Slip *</label>
          <input
            type="file"
            id="slipFile"
            name="slipFile"
            onChange={onFileChange}
            accept="image/*"
            required
          />
          {formData.slipFile && <p className="file-name">✓ {formData.slipFile.name}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-submit">
            Submit Payment Slip
          </button>
          <button type="button" className="btn btn-cancel" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </form>
);

export default BankPaymentForm;

