import type { AuthUser } from "./domain";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  playerName?: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  promoCode?: string;
  promocode?: string;
  teamName: string;
  primaryGame: string;
  game?: string;
  leaderInGameId: string;
  gameId?: string;
  members: Array<{
    name: string;
    inGameId: string;
    gameId?: string;
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
