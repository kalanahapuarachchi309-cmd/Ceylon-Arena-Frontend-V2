interface PaymentErrorViewProps {
  errorMessage: string;
  onRetry: () => void;
}

const PaymentErrorView = ({ errorMessage, onRetry }: PaymentErrorViewProps) => (
  <div className="error-container">
    <div className="error-box">
      <div className="error-icon">✕</div>
      <h2>Payment Failed</h2>
      <p className="error-message">{errorMessage}</p>
      <button className="btn btn-cancel" onClick={onRetry} style={{ marginTop: "20px" }}>
        Try Again
      </button>
    </div>
  </div>
);

export default PaymentErrorView;

