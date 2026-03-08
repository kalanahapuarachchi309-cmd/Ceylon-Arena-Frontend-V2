import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { paymentsApi } from "../api/paymentsApi";
import type { PaymentEntity, ReviewPaymentRequest, SubmitPaymentRequest } from "../types/payment.types";

interface UseMyPaymentsOptions {
  enabled?: boolean;
}

const MY_PAYMENTS_CACHE_TTL_MS = 20_000;
const myPaymentsCache = new Map<string, { data: PaymentEntity[]; timestamp: number }>();
const myPaymentsInflight = new Map<string, Promise<PaymentEntity[]>>();

const paramsKey = (params?: PaginationParams) => JSON.stringify(params ?? {});

export const useMyPayments = (
  params?: PaginationParams,
  { enabled = true }: UseMyPaymentsOptions = {}
) => {
  const stableParams = useMemo<PaginationParams | undefined>(
    () =>
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        : undefined,
    [params?.limit, params?.page, params?.search, params?.sortBy, params?.sortOrder]
  );

  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setPayments([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const key = paramsKey(stableParams);
      const now = Date.now();
      const cacheEntry = myPaymentsCache.get(key);
      if (cacheEntry && now - cacheEntry.timestamp < MY_PAYMENTS_CACHE_TTL_MS) {
        setPayments(cacheEntry.data);
        return;
      }

      let request = myPaymentsInflight.get(key);
      if (!request) {
        request = paymentsApi.getMyPayments(stableParams);
        myPaymentsInflight.set(key, request);
      }
      const result = await request;
      myPaymentsCache.set(key, { data: result, timestamp: now });
      setPayments(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      myPaymentsInflight.delete(paramsKey(stableParams));
      setIsLoading(false);
    }
  }, [enabled, stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitPayment = useCallback(
    async (registrationId: string, payload: SubmitPaymentRequest) => {
      const created = await paymentsApi.submitPayment(registrationId, payload);
      myPaymentsCache.clear();
      setPayments((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  return { payments, isLoading, error, refetch: load, submitPayment };
};

export const usePayments = (params?: PaginationParams) => {
  const stableParams = useMemo<PaginationParams | undefined>(
    () =>
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        : undefined,
    [params?.limit, params?.page, params?.search, params?.sortBy, params?.sortOrder]
  );

  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paymentsApi.getPayments(stableParams);
      setPayments(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const reviewPayment = useCallback(async (paymentId: string, payload: ReviewPaymentRequest) => {
    const updated = await paymentsApi.reviewPayment(paymentId, payload);
    setPayments((prev) =>
      prev.map((payment) => (resolveEntityId(payment) === paymentId ? updated : payment))
    );
    return updated;
  }, []);

  return { payments, isLoading, error, refetch: load, reviewPayment };
};
