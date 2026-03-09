import type { RegistrationNavigationState } from "./payment.types";

interface PaymentSuccessViewProps {
  registrationData: RegistrationNavigationState;
  onGoHome: () => void;
}

const PaymentSuccessView = ({ registrationData, onGoHome }: PaymentSuccessViewProps) => (
  <div className="success-container">
    <div className="success-box">
      <div className="success-icon">✓</div>
      <h2>Registration Complete!</h2>
      <p className="success-message">Thank you for completing your registration and payment.</p>

      <div className="success-details">
        <h3>Your Registration Details:</h3>
        <div className="success-item">
          <span>Player Name:</span>
          <strong>{registrationData.playerName}</strong>
        </div>
        <div className="success-item">
          <span>Email:</span>
          <strong>{registrationData.email}</strong>
        </div>
        <div className="success-item">
          <span>Team Name:</span>
          <strong>{registrationData.teamName}</strong>
        </div>
        <div className="success-item">
          <span>Game:</span>
          <strong>{registrationData.game?.toUpperCase()}</strong>
        </div>
        <div className="success-item total">
          <span>Payment Amount:</span>
          <strong>Rs 1,500</strong>
        </div>
      </div>

      <p className="redirect-message">You will be redirected to your home page in a few seconds...</p>
      <button className="btn btn-submit" onClick={onGoHome} style={{ marginTop: "20px", width: "100%" }}>
        Go to Home Page Now
      </button>
    </div>
  </div>
);

export default PaymentSuccessView;

