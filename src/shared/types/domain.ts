import type {
  EventStatus, PaymentStatus, RegistrationStatus, UserRole
} from "./enums";

export interface AuthUser {
  id: string;
  fullName: string;
  playerName?: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isActive?: boolean;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends AuthUser {
  promoCode?: string;
  teamId?: string;
  team?: Team;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  name: string;
  inGameId: string;
  gameId?: string;
}

export interface Team {
  id: string;
  teamName: string;
  name?: string;
  primaryGame: string;
  game?: string;
  leaderInGameId: string;
  leaderId?: string;
  members: TeamMember[];
  isActive?: boolean;
  createdBy?: string;
  createdByUser?: AuthUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  name?: string;
  gameName: string;
  game?: string;
  description: string;
  bannerImage?: string;
  rules?: string;
  entryFee: number;
  currency: string;
  maxTeams: number;
  teamLimit?: number;
  registrationOpenAt: string;
  registrationCloseAt: string;
  eventStartAt: string;
  eventEndAt: string;
  date?: string;
  prizePool?: string;
  status: EventStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  teamId: string;
  userId?: string;
  status: RegistrationStatus;
  notes?: string;
  event?: Event;
  team?: Team;
  createdByUser?: AuthUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  registrationId: string;
  amount?: number;
  method?: string;
  transactionReference?: string;
  transactionId?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  slipUrl?: string;
  slipFilePath?: string;
  status: PaymentStatus;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  registration?: EventRegistration;
  createdByUser?: AuthUser;
  createdAt?: string;
  updatedAt?: string;
}
