import { PaymentStatus, type Payment } from "../types";

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
  if (normalized === "APPROVED") return "verified";
  if (normalized === "REJECTED") return "rejected";
  return "pending";
};

export const mapPaymentToAdminRow = (payment: Payment): AdminPaymentRow => ({
  id: payment.id,
  playerName: payment.createdByUser?.fullName || payment.accountHolder || "Unknown",
  email: payment.createdByUser?.email || "",
  phone: payment.createdByUser?.phone || "",
  game: payment.registration?.event?.gameName || "",
  team: payment.registration?.team?.teamName || "",
  amount: `Rs ${(payment.registration?.event?.entryFee ?? 0).toFixed(2)}`,
  paymentDate: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "",
  paymentMethod: "Bank Transfer",
  transactionId: payment.transactionReference || "",
  status: normalizeStatus(payment.status),
  paymentSlipUrl: payment.slipUrl || payment.slipFilePath || "",
  registeredAt: payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "",
});
