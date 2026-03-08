import { axiosInstance } from "../../../shared/api/axiosInstance";
import type { AuthSession, AuthUser, ChangePasswordRequest, LoginRequest, RegisterRequest } from "../../../shared/types";
import type { ApiSuccessResponse } from "../../../shared/types";

type SessionPayload = {
  user?: AuthUser;
  accessToken?: string;
  data?: {
    user?: AuthUser;
    accessToken?: string;
  };
};

type ProfilePayload = {
  user?: AuthUser;
  data?: {
    user?: AuthUser;
  };
};

type RefreshPayload = {
  accessToken?: string;
  data?: {
    accessToken?: string;
  };
};

const unwrapResponse = <T>(payload: ApiSuccessResponse<T> | T): T =>
  typeof payload === "object" && payload !== null && "success" in payload
    ? (payload as ApiSuccessResponse<T>).data
    : (payload as T);

const toAuthSession = (payload: SessionPayload): AuthSession => {
  const sessionData = payload.data ?? payload;
  const user = sessionData.user;
  const accessToken = sessionData.accessToken;

  if (!user || !accessToken) {
    throw new Error("Invalid auth session response.");
  }

  return { user, accessToken };
};

export const authApi = {
  async register(payload: RegisterRequest): Promise<AuthSession> {
    const response = await axiosInstance.post<ApiSuccessResponse<SessionPayload> | SessionPayload>(
      "/auth/register",
      payload
    );
    const raw = unwrapResponse(response.data);
    return toAuthSession(raw);
  },

  async login(payload: LoginRequest): Promise<AuthSession> {
    const response = await axiosInstance.post<ApiSuccessResponse<SessionPayload> | SessionPayload>(
      "/auth/login",
      payload
    );
    const raw = unwrapResponse(response.data);
    return toAuthSession(raw);
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  async refresh(): Promise<string> {
    const response = await axiosInstance.post<ApiSuccessResponse<RefreshPayload> | RefreshPayload>("/auth/refresh");
    const payload = unwrapResponse(response.data);
    const accessToken = payload.data?.accessToken ?? payload.accessToken;

    if (!accessToken) {
      throw new Error("Refresh response does not include access token.");
    }

    return accessToken;
  },

  async me(): Promise<AuthUser> {
    const response = await axiosInstance.get<ApiSuccessResponse<ProfilePayload> | ProfilePayload>("/auth/me");
    const payload = unwrapResponse(response.data);
    const user = payload.data?.user ?? payload.user;

    if (!user) {
      throw new Error("Profile response does not include user.");
    }

    return user;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await axiosInstance.patch("/auth/change-password", payload);
  },
};
