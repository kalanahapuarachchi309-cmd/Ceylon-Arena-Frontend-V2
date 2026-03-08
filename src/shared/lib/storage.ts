import type { AuthUser } from "../types";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "user";
const AUTH_TEAM_SUMMARY_KEY = "teamSummary";

export interface AuthTeamSummary {
  ownerId: string;
  teamName: string;
}

export const storageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  authUser: AUTH_USER_KEY,
  authTeamSummary: AUTH_TEAM_SUMMARY_KEY,
} as const;

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const setStoredUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredTeamSummary = (): AuthTeamSummary | null => {
  const raw = localStorage.getItem(AUTH_TEAM_SUMMARY_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthTeamSummary;
    if (typeof parsed.ownerId !== "string" || typeof parsed.teamName !== "string") {
      localStorage.removeItem(AUTH_TEAM_SUMMARY_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_TEAM_SUMMARY_KEY);
    return null;
  }
};

export const setStoredTeamSummary = (summary: AuthTeamSummary) => {
  localStorage.setItem(AUTH_TEAM_SUMMARY_KEY, JSON.stringify(summary));
};

export const removeStoredTeamSummary = () => {
  localStorage.removeItem(AUTH_TEAM_SUMMARY_KEY);
};

export const clearAuthStorage = () => {
  removeAccessToken();
  removeStoredUser();
  removeStoredTeamSummary();
  localStorage.removeItem("refreshToken");
};
