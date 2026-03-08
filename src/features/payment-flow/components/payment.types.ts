export type PaymentMethod = "card" | "bank" | null;

export type PaymentStatus =
  | "method-selection"
  | "card-form"
  | "bank-form"
  | "processing"
  | "success"
  | "error";

export interface PaymentFormData {
  amount: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  transactionId: string;
  slipFile: File | null;
}

export interface RegistrationNavigationState {
  playerName: string;
  email: string;
  phone: string;
  teamName: string;
  game: string;
  password: string;
  promocode?: string;
  leaderAddress: string;
  gameId: string;
  player2Name?: string;
  player2GameId?: string;
  player3Name?: string;
  player3GameId?: string;
  player4Name?: string;
  player4GameId?: string;
  registrationId?: string;
  eventId?: string;
}

export const defaultPaymentFormData: PaymentFormData = {
  amount: "1500",
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  transactionId: "",
  slipFile: null,
};

