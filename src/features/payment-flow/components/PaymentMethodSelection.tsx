import type { RegistrationNavigationState } from "./payment.types";

interface PaymentMethodSelectionProps {
  registrationData: RegistrationNavigationState;
  onSelectMethod: (method: "bank") => void;
}

const PaymentMethodSelection = ({ registrationData, onSelectMethod }: PaymentMethodSelectionProps) => (
  <div className="payment-method-selection">
    <div className="registration-summary">
      <h3>✓ Registration Summary</h3>
      <div className="summary-item">
        <span>👤 Player Name:</span>
        <strong>{registrationData.playerName}</strong>
      </div>
      <div className="summary-item">
        <span>📧 Email:</span>
        <strong>{registrationData.email}</strong>
      </div>
      <div className="summary-item">
        <span>📱 Phone:</span>
        <strong>{registrationData.phone}</strong>
      </div>
      <div className="summary-item">
        <span>🎮 Team Name:</span>
        <strong>{registrationData.teamName}</strong>
      </div>
      <div className="summary-item">
        <span>🎯 Game:</span>
        <strong>{registrationData.game?.toUpperCase()}</strong>
      </div>
      <div className="summary-total">
        <span>💰 Amount to Pay:</span>
        <strong>Rs 1,500</strong>
      </div>
    </div>

    <div className="payment-methods">
      <div className="payment-method-card" onClick={() => onSelectMethod("bank")}>
        <div className="method-icon">🏦</div>
        <h3>Bank Transfer</h3>
        <p>Transfer via UPI/Bank Account</p>
        <button className="btn btn-method">Select Bank Transfer</button>
      </div>
    </div>
  </div>
);

export default PaymentMethodSelection;

