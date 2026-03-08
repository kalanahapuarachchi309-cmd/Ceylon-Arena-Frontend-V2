import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { authApi } from "../features/auth/api/authApi";
import { clearAuthStorage, getAccessToken, getStoredUser, setAccessToken, setStoredUser } from "../shared/lib/storage";
import type {
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "../shared/types";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<AuthSession>;
  register: (payload: RegisterRequest) => Promise<AuthSession>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<void>;
  changePassword: (payload: ChangePasswordRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const persistSession = (session: AuthSession) => {
  setAccessToken(session.accessToken);
  setStoredUser(session.user);
};

const clearSession = () => {
  clearAuthStorage();
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const applySession = useCallback((session: AuthSession) => {
    persistSession(session);
    setUser(session.user);
  }, []);

  const refreshSession = useCallback(async () => {
    const nextToken = await authApi.refresh();
    setAccessToken(nextToken);
    const profile = await authApi.me();
    setStoredUser(profile);
    setUser(profile);
  }, []);

  const bootstrapAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await authApi.me();
      setStoredUser(profile);
      setUser(profile);

      if (!getAccessToken()) {
        try {
          const refreshedToken = await authApi.refresh();
          setAccessToken(refreshedToken);
        } catch {
          // Session is still valid via cookies, token refresh can be deferred.
        }
      }
    } catch {
      try {
        await refreshSession();
      } catch {
        clearSession();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const session = await authApi.login(payload);
      applySession(session);
      return session;
    },
    [applySession]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const session = await authApi.register(payload);
      applySession(session);
      return session;
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const changePassword = useCallback(async (payload: ChangePasswordRequest) => {
    await authApi.changePassword(payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      logoutAll,
      refreshSession,
      changePassword,
    }),
    [user, isLoading, login, register, logout, logoutAll, refreshSession, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
