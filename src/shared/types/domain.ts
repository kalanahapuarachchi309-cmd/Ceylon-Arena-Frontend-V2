import type {
  EventStatus, PaymentStatus, RegistrationStatus, UserRole
} from "./enums";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isActive?: boolean;
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
}

export interface Team {
  id: string;
  teamName: string;
  primaryGame: string;
  leaderInGameId: string;
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
  gameName: string;
  description: string;
  bannerImage?: string;
  rules?: string;
  entryFee: number;
  currency: string;
  maxTeams: number;
  registrationOpenAt: string;
  registrationCloseAt: string;
  eventStartAt: string;
  eventEndAt: string;
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
  transactionReference?: string;
  bankName?: string;
  accountHolder?: string;
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
