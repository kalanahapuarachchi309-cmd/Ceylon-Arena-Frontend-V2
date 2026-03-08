export const UserRole = {
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const EventStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
} as const;
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

export const RegistrationStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAYMENT_SUBMITTED: "PAYMENT_SUBMITTED",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;
export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  BANK: "BANK",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
