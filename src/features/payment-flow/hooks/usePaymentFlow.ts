import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { paymentsApi } from "../../payments/api/paymentsApi";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { defaultPaymentFormData, type PaymentFormData, type PaymentMethod, type PaymentStatus, type RegistrationNavigationState } from "../components/payment.types";

interface UsePaymentFlowOptions {
  registrationData: RegistrationNavigationState;
  onSuccess: () => void;
}

const MAX_BANK_SLIP_SIZE_BYTES = 8 * 1024 * 1024;

export const usePaymentFlow = ({ registrationData, onSuccess }: UsePaymentFlowOptions) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
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
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        slipFile: null,
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      const message = "Please upload an image file for the payment slip.";
      setErrorMessage(message);
      toast.error({
        title: "Upload Failed",
        message,
        dedupeKey: "payment-flow-invalid-slip-type",
      });
      setFormData((prev) => ({
        ...prev,
        slipFile: null,
      }));
      return;
    }

    if (file.size > MAX_BANK_SLIP_SIZE_BYTES) {
      const message = "Payment slip is too large. Maximum allowed size is 8 MB.";
      setErrorMessage(message);
      toast.error({
        title: "Upload Failed",
        message,
        dedupeKey: "payment-flow-invalid-slip-size",
      });
      setFormData((prev) => ({
        ...prev,
        slipFile: null,
      }));
      return;
    }

    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      slipFile: file,
    }));
    toast.success({
      title: "Slip Added",
      message: `${file.name} is ready to submit.`,
      dedupeKey: `payment-flow-slip-selected:${file.name}:${file.size}`,
    });
  }, [toast]);

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
        const message = "Please fill all card details.";
        setPaymentStatus("error");
        setErrorMessage(message);
        toast.warning({
          title: "Missing Card Details",
          message,
          dedupeKey: "payment-flow-card-validation",
        });
        return;
      }

      setPaymentStatus("error");
      const message = "Card payment is unavailable for this backend. Please use bank transfer.";
      setErrorMessage(message);
      toast.info({
        title: "Card Payment Unavailable",
        message,
        dedupeKey: "payment-flow-card-unavailable",
      });
    },
    [formData, toast]
  );

  const handleBankPayment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formData.bankName || !formData.accountHolder || !formData.accountNumber || !formData.slipFile) {
        const message = "Please fill all bank details and upload payment slip.";
        setPaymentStatus("error");
        setErrorMessage(message);
        toast.warning({
          title: "Missing Payment Details",
          message,
          dedupeKey: "payment-flow-bank-validation",
        });
        return;
      }

      setPaymentStatus("processing");
      setErrorMessage("");

      try {
        const registrationId = await ensureRegistrationId();
        await toast.promise(
          paymentsApi.submitPayment(registrationId, {
            slip: formData.slipFile,
            bankName: formData.bankName,
            accountHolder: formData.accountHolder,
            transactionReference: formData.transactionId,
          }),
          {
            loading: {
              title: "Submitting Payment",
              message: "Uploading your payment slip...",
              dedupeKey: "payment-flow-submit-loading",
            },
            success: {
              title: "Payment Submitted",
              message: "Your payment submission has been received.",
            },
            error: (error) => ({
              title: "Payment Submission Failed",
              message: getErrorMessage(error),
            }),
          }
        );
        completeSuccess();
      } catch (error) {
        const message = getErrorMessage(error);
        setPaymentStatus("error");
        setErrorMessage(message);
      }
    },
    [completeSuccess, ensureRegistrationId, formData, toast]
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
