import { PaymentMethod, PaymentStatus, type Payment } from "../types";

export type AdminPaymentRow = {
  id: string;
  playerName: string;
  email: string;
  phone: string;
  game: string;
  team: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  status: "verified" | "pending" | "rejected";
  paymentSlipUrl: string;
  registeredAt: string;
};

const normalizeStatus = (status: PaymentStatus | string): AdminPaymentRow["status"] => {
  const normalized = String(status).toUpperCase();
  if (normalized === "COMPLETED" || normalized === "VERIFIED") return "verified";
  if (normalized === "FAILED" || normalized === "REJECTED") return "rejected";
  return "pending";
};

export const mapPaymentToAdminRow = (payment: Payment): AdminPaymentRow => ({
  id: payment.id,
  playerName: payment.accountHolder || "Unknown",
  email: "",
  phone: payment.accountNumber || "",
  game: "",
  team: "",
  amount: `Rs ${payment.amount.toFixed(2)}`,
  paymentDate: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "",
  paymentMethod: payment.method === PaymentMethod.BANK ? "Bank Transfer" : "Card",
  transactionId: payment.transactionId || "",
  status: normalizeStatus(payment.status),
  paymentSlipUrl: payment.slipFilePath || "",
  registeredAt: payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "",
});

