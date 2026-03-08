import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { paymentsApi } from "../../payments/api/paymentsApi";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { defaultPaymentFormData, type PaymentFormData, type PaymentMethod, type PaymentStatus, type RegistrationNavigationState } from "../components/payment.types";

interface UsePaymentFlowOptions {
  registrationData: RegistrationNavigationState;
  onSuccess: () => void;
}

export const usePaymentFlow = ({ registrationData, onSuccess }: UsePaymentFlowOptions) => {
  const { isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("method-selection");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<PaymentFormData>(defaultPaymentFormData);

  const safeRegistrationData = useMemo<RegistrationNavigationState>(
    () => ({
      ...registrationData,
      playerName: registrationData.playerName ?? "",
      email: registrationData.email ?? "",
      phone: registrationData.phone ?? "",
      teamName: registrationData.teamName ?? "",
      game: registrationData.game ?? "",
      password: registrationData.password ?? "",
      leaderAddress: registrationData.leaderAddress ?? "",
      gameId: registrationData.gameId ?? "",
    }),
    [registrationData]
  );

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        slipFile: file,
      }));
    }
  }, []);

  const ensureRegistrationId = useCallback(async (): Promise<string> => {
    if (safeRegistrationData.registrationId) {
      return safeRegistrationData.registrationId;
    }

    if (!isAuthenticated) {
      throw new Error("Please sign in and register for the event before submitting payment.");
    }

    throw new Error("Registration is required before payment submission.");
  }, [isAuthenticated, safeRegistrationData.registrationId]);

  const completeSuccess = useCallback(() => {
    setPaymentStatus("success");
    window.setTimeout(() => {
      onSuccess();
    }, 3000);
  }, [onSuccess]);

  const handleCardPayment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
        setPaymentStatus("error");
        setErrorMessage("Please fill all card details.");
        return;
      }

      setPaymentStatus("error");
      setErrorMessage("Card payment is unavailable for this backend. Please use bank transfer.");
    },
    [formData]
  );

  const handleBankPayment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formData.bankName || !formData.accountHolder || !formData.accountNumber || !formData.slipFile) {
        setPaymentStatus("error");
        setErrorMessage("Please fill all bank details and upload payment slip.");
        return;
      }

      setPaymentStatus("processing");
      setErrorMessage("");

      try {
        const registrationId = await ensureRegistrationId();
        await paymentsApi.submitPayment(registrationId, {
          slip: formData.slipFile,
          bankName: formData.bankName,
          accountHolder: formData.accountHolder,
          transactionReference: formData.transactionId,
        });
        completeSuccess();
      } catch (error) {
        setPaymentStatus("error");
        setErrorMessage(getErrorMessage(error));
      }
    },
    [completeSuccess, ensureRegistrationId, formData]
  );

  return {
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
    registrationData: safeRegistrationData,
  };
};
