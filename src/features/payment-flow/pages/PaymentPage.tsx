import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import BankPaymentForm from "../components/BankPaymentForm";
import CardPaymentForm from "../components/CardPaymentForm";
import PaymentErrorView from "../components/PaymentErrorView";
import PaymentHeader from "../components/PaymentHeader";
import PaymentMethodSelection from "../components/PaymentMethodSelection";
import PaymentProcessingView from "../components/PaymentProcessingView";
import PaymentSuccessView from "../components/PaymentSuccessView";
import type { RegistrationNavigationState } from "../components/payment.types";
import { usePaymentFlow } from "../hooks/usePaymentFlow";
import { useToast } from "../../../shared/providers/CustomToastProvider";

import "../../../components/Payment.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const navigationState = (location.state ?? {}) as Partial<RegistrationNavigationState>;
  const missingRegistrationData = !navigationState.playerName || !navigationState.email;

  useEffect(() => {
    if (!missingRegistrationData) {
      return;
    }

    toast.error({
      title: "Registration Data Missing",
      message: "Please complete registration before payment.",
      dedupeKey: "payment-page-missing-registration-data",
    });
  }, [missingRegistrationData, toast]);

  const {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    errorMessage,
    formData,
    handleInputChange,
    handleFileChange,
    handleCardPayment,
    handleBankPayment,
    registrationData,
  } = usePaymentFlow({
    registrationData: {
      playerName: navigationState.playerName ?? "",
      email: navigationState.email ?? "",
      phone: navigationState.phone ?? "",
      teamName: navigationState.teamName ?? "",
      game: navigationState.game ?? "",
      password: navigationState.password ?? "",
      promocode: navigationState.promocode,
      leaderAddress: navigationState.leaderAddress ?? "",
      gameId: navigationState.gameId ?? "",
      player2Name: navigationState.player2Name,
      player2GameId: navigationState.player2GameId,
      player3Name: navigationState.player3Name,
      player3GameId: navigationState.player3GameId,
      player4Name: navigationState.player4Name,
      player4GameId: navigationState.player4GameId,
      registrationId: navigationState.registrationId,
      eventId: navigationState.eventId,
    },
    onSuccess: () => navigate("/"),
  });

  if (missingRegistrationData) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-container">
            <div className="error-box">
              <div className="error-icon">✕</div>
              <h2>Registration Data Missing</h2>
              <p className="error-message">Please complete registration before payment.</p>
              <button className="btn btn-cancel" onClick={() => navigate("/register")} style={{ marginTop: "20px" }}>
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <PaymentHeader paymentStatus={paymentStatus} onBack={() => navigate("/register")} />

        {paymentStatus === "success" ? (
          <PaymentSuccessView registrationData={registrationData} onGoHome={() => navigate("/")} />
        ) : paymentStatus === "processing" ? (
          <PaymentProcessingView />
        ) : paymentStatus === "error" ? (
          <PaymentErrorView errorMessage={errorMessage} onRetry={() => setPaymentStatus("method-selection")} />
        ) : !paymentMethod ? (
          <PaymentMethodSelection registrationData={registrationData} onSelectMethod={() => setPaymentMethod("bank")} />
        ) : paymentMethod === "card" ? (
          <CardPaymentForm
            formData={formData}
            onChange={handleInputChange}
            onBack={() => setPaymentMethod(null)}
            onSubmit={handleCardPayment}
          />
        ) : (
          <BankPaymentForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onBack={() => setPaymentMethod(null)}
            onSubmit={handleBankPayment}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
