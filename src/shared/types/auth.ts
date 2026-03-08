import type { AuthUser } from "./domain";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  promoCode?: string;
  teamName: string;
  primaryGame: string;
  leaderInGameId: string;
  members: Array<{
    name: string;
    inGameId: string;
  }>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}
