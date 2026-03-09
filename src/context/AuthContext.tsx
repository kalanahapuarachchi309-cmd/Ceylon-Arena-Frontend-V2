import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import axios from "axios";

import { authApi } from "../features/auth/api/authApi";
import { teamsApi } from "../features/teams/api/teamsApi";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredTeamSummary,
  getStoredUser,
  removeStoredTeamSummary,
  setAccessToken,
  setStoredTeamSummary,
  setStoredUser,
  type AuthTeamSummary,
} from "../shared/lib/storage";
import { toast } from "../shared/toast";
import type {
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "../shared/types";
import { UserRole } from "../shared/types";

export interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  teamSummary: AuthTeamSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginRequest) => Promise<AuthSession>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  restoreSession: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshTeamSummary: () => Promise<void>;
  changePassword: (payload: ChangePasswordRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const persistSession = (session: AuthSession) => {
  setAccessToken(session.accessToken);
  setStoredUser(session.user);
};

const clearSessionStorage = () => {
  clearAuthStorage();
};

const isUnauthorizedError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

const runSessionRestore = async (): Promise<AuthUser | null> => {
  const token = getAccessToken();
  const storedUser = getStoredUser();

  if (!token && !storedUser) {
    clearSessionStorage();
    return null;
  }

  try {
    let profile: AuthUser | null = null;

    if (token) {
      try {
        profile = await authApi.me({ skipAuthRefresh: true });
      } catch (error) {
        if (!isUnauthorizedError(error)) {
          throw error;
        }
      }
    }

    if (!profile) {
      const refreshedToken = await authApi.refresh();
      setAccessToken(refreshedToken);
      profile = await authApi.me({ skipAuthRefresh: true });
    }

    setStoredUser(profile);
    return profile;
  } catch {
    clearSessionStorage();
    return null;
  }
};

let sharedRestorePromise: Promise<AuthUser | null> | null = null;

const restoreSessionShared = async () => {
  if (!sharedRestorePromise) {
    sharedRestorePromise = runSessionRestore().finally(() => {
      sharedRestorePromise = null;
    });
  }

  return sharedRestorePromise;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [teamSummary, setTeamSummary] = useState<AuthTeamSummary | null>(getStoredTeamSummary());
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const isMountedRef = useRef<boolean>(true);
  const teamSummaryPromiseRef = useRef<Promise<void> | null>(null);

  const applySession = useCallback((session: AuthSession) => {
    persistSession(session);
    setUser(session.user);
    removeStoredTeamSummary();
    setTeamSummary(null);
  }, []);

  const clearSessionState = useCallback(() => {
    clearSessionStorage();
    teamSummaryPromiseRef.current = null;
    setUser(null);
    setTeamSummary(null);
  }, []);

  const restoreSession = useCallback(async () => {
    setIsBootstrapping(true);

    try {
      const profile = await restoreSessionShared();
      if (!isMountedRef.current) {
        return;
      }

      setUser(profile);

      if (!profile || profile.role !== UserRole.PLAYER) {
        removeStoredTeamSummary();
        setTeamSummary(null);
        return;
      }

      const storedSummary = getStoredTeamSummary();
      if (storedSummary?.ownerId === profile.id) {
        setTeamSummary(storedSummary);
      } else {
        removeStoredTeamSummary();
        setTeamSummary(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsBootstrapping(false);
      }
    }
  }, []);

  const refreshTeamSummary = useCallback(async () => {
    if (!user || user.role !== UserRole.PLAYER) {
      removeStoredTeamSummary();
      setTeamSummary(null);
      return;
    }

    if (teamSummaryPromiseRef.current) {
      await teamSummaryPromiseRef.current;
      return;
    }

    teamSummaryPromiseRef.current = (async () => {
      try {
        const team = await teamsApi.getMyTeam();

        if (!team?.teamName) {
          removeStoredTeamSummary();
          setTeamSummary(null);
          return;
        }

        const summary: AuthTeamSummary = {
          ownerId: user.id,
          teamName: team.teamName,
        };
        setStoredTeamSummary(summary);
        setTeamSummary(summary);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          clearSessionState();
        }
      } finally {
        teamSummaryPromiseRef.current = null;
      }
    })();

    await teamSummaryPromiseRef.current;
  }, [clearSessionState, user]);

  useEffect(() => {
    isMountedRef.current = true;
    void restoreSession();

    return () => {
      isMountedRef.current = false;
    };
  }, [restoreSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      const hasRestorableSession = Boolean(getAccessToken() || getStoredUser());
      clearSessionState();
      setIsBootstrapping(false);
      if (hasRestorableSession) {
        toast.warning({
          title: "Session Expired",
          message: "Your session has expired. Please sign in again.",
          duration: 6000,
          dedupeKey: "auth-session-expired",
        });
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearSessionState]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const session = await authApi.login(payload);
      applySession(session);
      return session;
    },
    [applySession]
  );

  const register = useCallback(async (payload: RegisterRequest) => {
    await authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSessionState();
    }
  }, [clearSessionState]);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } finally {
      clearSessionState();
    }
  }, [clearSessionState]);

  const changePassword = useCallback(async (payload: ChangePasswordRequest) => {
    await authApi.changePassword(payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      teamSummary,
      isAuthenticated: Boolean(user),
      isLoading: isBootstrapping,
      isInitializing: isBootstrapping,
      isBootstrapping,
      login,
      register,
      logout,
      logoutAll,
      restoreSession,
      refreshAuth: restoreSession,
      refreshTeamSummary,
      changePassword,
    }),
    [
      user,
      teamSummary,
      isBootstrapping,
      login,
      register,
      logout,
      logoutAll,
      restoreSession,
      refreshTeamSummary,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
