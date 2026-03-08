import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { paymentsApi } from "../../payments/api/paymentsApi";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { defaultPaymentFormData, type PaymentFormData, type PaymentMethod, type PaymentStatus, type RegistrationNavigationState } from "../components/payment.types";

const resolveId = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.id === "string") {
    return record.id;
  }
  if (typeof record._id === "string") {
    return record._id;
  }
  return null;
};

interface UsePaymentFlowOptions {
  registrationData: RegistrationNavigationState;
  onSuccess: () => void;
}

export const usePaymentFlow = ({ registrationData, onSuccess }: UsePaymentFlowOptions) => {
  const { register, isAuthenticated } = useAuth();
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
      await register({
        playerName: safeRegistrationData.playerName,
        email: safeRegistrationData.email,
        password: safeRegistrationData.password,
        phone: safeRegistrationData.phone,
      });
    }

    const createdRegistration = await registrationsApi.createRegistration({
      eventId: safeRegistrationData.eventId || safeRegistrationData.game,
    });

    const registrationId = resolveId(createdRegistration);
    if (!registrationId) {
      throw new Error("Could not resolve registration ID from response.");
    }

    return registrationId;
  }, [isAuthenticated, register, safeRegistrationData]);

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
        alert("Please fill all card details");
        return;
      }

      setPaymentStatus("processing");
      setErrorMessage("");

      try {
        const registrationId = await ensureRegistrationId();
        await paymentsApi.submitPayment(registrationId, {
          amount: formData.amount,
          method: "CARD",
          transactionId: formData.cardNumber.slice(-6),
        });
        completeSuccess();
      } catch (error) {
        setPaymentStatus("error");
        setErrorMessage(getErrorMessage(error));
      }
    },
    [completeSuccess, ensureRegistrationId, formData]
  );

  const handleBankPayment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formData.bankName || !formData.accountHolder || !formData.accountNumber || !formData.slipFile) {
        alert("Please fill all bank details and upload payment slip");
        return;
      }

      setPaymentStatus("processing");
      setErrorMessage("");

      try {
        const registrationId = await ensureRegistrationId();
        await paymentsApi.submitPayment(registrationId, {
          amount: formData.amount,
          method: "BANK",
          bankName: formData.bankName,
          accountHolder: formData.accountHolder,
          accountNumber: formData.accountNumber,
          transactionId: formData.transactionId,
          slipFile: formData.slipFile,
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
