import type { Payment } from "../../../shared/types";
import type { PaymentStatus } from "../../../shared/types";

export interface SubmitPaymentRequest {
  slip: File;
  transactionReference?: string;
  bankName?: string;
  accountHolder?: string;
}

export interface ReviewPaymentRequest {
  status: Exclude<PaymentStatus, "PENDING">;
  adminNote?: string;
}

export type PaymentEntity = Payment;
