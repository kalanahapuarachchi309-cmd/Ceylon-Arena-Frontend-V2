import { axiosInstance } from "../../../shared/api/axiosInstance";
import { unwrapApiData } from "../../../shared/api/apiTypes";
import type { PaginationParams } from "../../../shared/types";
import type { PaymentEntity, ReviewPaymentRequest, SubmitPaymentRequest } from "../types/payment.types";

const toQueryString = (params?: PaginationParams) => {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const queryText = query.toString();
  return queryText ? `?${queryText}` : "";
};

const toPayments = (payload: unknown): PaymentEntity[] => {
  if (Array.isArray(payload)) {
    return payload as PaymentEntity[];
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as PaymentEntity[];
    }
    if (Array.isArray(record.payments)) {
      return record.payments as PaymentEntity[];
    }
  }
  return [];
};

const toFormData = (payload: SubmitPaymentRequest): FormData => {
  const formData = new FormData();
  formData.append("amount", payload.amount);
  formData.append("method", payload.method);

  if (payload.bankName) formData.append("bankName", payload.bankName);
  if (payload.accountHolder) formData.append("accountHolder", payload.accountHolder);
  if (payload.accountNumber) formData.append("accountNumber", payload.accountNumber);
  if (payload.transactionId) formData.append("transactionId", payload.transactionId);
  if (payload.slipFile) formData.append("slipFile", payload.slipFile);

  return formData;
};

export const paymentsApi = {
  async submitPayment(registrationId: string, payload: SubmitPaymentRequest): Promise<PaymentEntity> {
    const response = await axiosInstance.post(`/payments/submit/${registrationId}`, toFormData(payload), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapApiData(response.data) as PaymentEntity;
  },

  async getMyPayments(params?: PaginationParams): Promise<PaymentEntity[]> {
    const response = await axiosInstance.get(`/payments/my${toQueryString(params)}`);
    return toPayments(unwrapApiData(response.data));
  },

  async getPaymentById(id: string): Promise<PaymentEntity> {
    const response = await axiosInstance.get(`/payments/${id}`);
    return unwrapApiData(response.data) as PaymentEntity;
  },

  async getPayments(params?: PaginationParams): Promise<PaymentEntity[]> {
    const response = await axiosInstance.get(`/payments${toQueryString(params)}`);
    return toPayments(unwrapApiData(response.data));
  },

  async reviewPayment(id: string, payload: ReviewPaymentRequest): Promise<PaymentEntity> {
    const response = await axiosInstance.patch(`/payments/${id}/review`, payload);
    return unwrapApiData(response.data) as PaymentEntity;
  },

  async deletePayment(id: string): Promise<void> {
    await axiosInstance.delete(`/payments/${id}`);
  },
};

