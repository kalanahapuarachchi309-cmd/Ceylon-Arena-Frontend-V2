import type { AuthUser } from "../types";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "user";

export const storageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  authUser: AUTH_USER_KEY,
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

export const clearAuthStorage = () => {
  removeAccessToken();
  removeStoredUser();
  localStorage.removeItem("refreshToken");
};

