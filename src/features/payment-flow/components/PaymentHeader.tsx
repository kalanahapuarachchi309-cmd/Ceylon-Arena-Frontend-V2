import type { PaymentStatus } from "./payment.types";

interface PaymentHeaderProps {
  paymentStatus: PaymentStatus;
  onBack: () => void;
}

const PaymentHeader = ({ paymentStatus, onBack }: PaymentHeaderProps) => (
  <div className="payment-header">
    <button className="btn-back-payment" onClick={onBack} disabled={paymentStatus === "processing"}>
      ← Back to Registration
    </button>
    <h1 className="payment-title">
      <span className="gradient-text">
        {paymentStatus === "success" ? "Registration Successful! 🎉" : "Complete Payment"}
      </span>
    </h1>
    <p className="payment-subtitle">
      {paymentStatus === "success"
        ? "Your registration is complete. Redirecting to home page..."
        : paymentStatus === "processing"
          ? "Processing your payment..."
          : paymentStatus === "error"
            ? "Payment Error"
            : "Choose your preferred payment method"}
    </p>
  </div>
);

export default PaymentHeader;

