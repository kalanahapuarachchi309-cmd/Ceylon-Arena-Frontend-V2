import { axiosInstance } from "../../../shared/api/axiosInstance";
import { extractList, unwrapApiData } from "../../../shared/api/apiTypes";
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

const toFormData = (payload: SubmitPaymentRequest): FormData => {
  const formData = new FormData();
  const slip = payload.slip ?? payload.slipFile;
  if (!slip) {
    throw new Error("Payment slip file is required.");
  }

  formData.append("slip", slip);
  const transactionReference = payload.transactionReference ?? payload.transactionId;
  if (transactionReference) formData.append("transactionReference", transactionReference);
  if (payload.bankName) formData.append("bankName", payload.bankName);
  if (payload.accountHolder) formData.append("accountHolder", payload.accountHolder);
  if (payload.accountNumber) formData.append("accountNumber", payload.accountNumber);
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
    return extractList<PaymentEntity>(unwrapApiData(response.data), ["payments"]);
  },

  async getPaymentById(id: string): Promise<PaymentEntity> {
    const response = await axiosInstance.get(`/payments/${id}`);
    return unwrapApiData(response.data) as PaymentEntity;
  },

  async getPayments(params?: PaginationParams): Promise<PaymentEntity[]> {
    const response = await axiosInstance.get(`/payments${toQueryString(params)}`);
    return extractList<PaymentEntity>(unwrapApiData(response.data), ["payments"]);
  },

  async reviewPayment(id: string, payload: ReviewPaymentRequest): Promise<PaymentEntity> {
    const response = await axiosInstance.patch(`/payments/${id}/review`, payload);
    return unwrapApiData(response.data) as PaymentEntity;
  },

  async deletePayment(id: string): Promise<void> {
    await axiosInstance.delete(`/payments/${id}`);
  },
};
