import { useCallback, useEffect, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { paymentsApi } from "../api/paymentsApi";
import type { PaymentEntity, ReviewPaymentRequest, SubmitPaymentRequest } from "../types/payment.types";

export const useMyPayments = (params?: PaginationParams) => {
  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paymentsApi.getMyPayments(params);
      setPayments(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitPayment = useCallback(
    async (registrationId: string, payload: SubmitPaymentRequest) => {
      const created = await paymentsApi.submitPayment(registrationId, payload);
      setPayments((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  return { payments, isLoading, error, refetch: load, submitPayment };
};

export const usePayments = (params?: PaginationParams) => {
  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paymentsApi.getPayments(params);
      setPayments(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const reviewPayment = useCallback(async (paymentId: string, payload: ReviewPaymentRequest) => {
    const updated = await paymentsApi.reviewPayment(paymentId, payload);
    setPayments((prev) => prev.map((payment) => (payment.id === paymentId ? updated : payment)));
    return updated;
  }, []);

  return { payments, isLoading, error, refetch: load, reviewPayment };
};

