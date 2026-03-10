import { axiosInstance, requestTokenRefresh } from "../../../shared/api/axiosInstance";
import type { ApiSuccessResponse } from "../../../shared/types";
import type { AuthSession, AuthUser, ChangePasswordRequest, LoginRequest, RegisterRequest } from "../../../shared/types";

type UnknownRecord = Record<string, unknown>;

interface RegisterResult {
  session: AuthSession;
  teamName?: string;
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const unwrapApiEnvelope = <T>(payload: ApiSuccessResponse<T> | T): T => {
  if (isRecord(payload) && payload.success === true && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
};

const resolveId = (payload: UnknownRecord): string => {
  if (typeof payload.id === "string") {
    return payload.id;
  }

  if (typeof payload._id === "string") {
    return payload._id;
  }

  throw new Error("Auth user response does not include a valid id.");
};

const normalizeAuthUser = (payload: unknown): AuthUser => {
  if (!isRecord(payload)) {
    throw new Error("Invalid auth user payload.");
  }

  const fullName =
    typeof payload.fullName === "string"
      ? payload.fullName
      : typeof payload.playerName === "string"
        ? payload.playerName
        : "";

  const email = typeof payload.email === "string" ? payload.email : "";
  const role = payload.role === "ADMIN" ? "ADMIN" : "PLAYER";

  return {
    id: resolveId(payload),
    fullName,
    playerName: fullName,
    email,
    role,
    phone: typeof payload.phone === "string" ? payload.phone : undefined,
    address: typeof payload.address === "string" ? payload.address : undefined,
    isActive:
      typeof payload.isActive === "boolean"
        ? payload.isActive
        : typeof payload.status === "boolean"
          ? payload.status
          : undefined,
    status:
      typeof payload.status === "boolean"
        ? payload.status
        : typeof payload.isActive === "boolean"
          ? payload.isActive
          : undefined,
    createdAt: typeof payload.createdAt === "string" ? payload.createdAt : undefined,
    updatedAt: typeof payload.updatedAt === "string" ? payload.updatedAt : undefined,
  };
};

const extractToken = (payload: unknown): string => {
  if (isRecord(payload) && typeof payload.accessToken === "string") {
    return payload.accessToken;
  }

  if (isRecord(payload) && isRecord(payload.data) && typeof payload.data.accessToken === "string") {
    return payload.data.accessToken;
  }

  throw new Error("Auth response does not include access token.");
};

const extractSession = (payload: unknown): AuthSession => {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(data) || !("user" in data)) {
    throw new Error("Invalid auth session payload.");
  }

  return {
    user: normalizeAuthUser(data.user),
    accessToken: extractToken(data),
  };
};

const extractUser = (payload: unknown): AuthUser => {
  if (isRecord(payload) && "user" in payload) {
    return normalizeAuthUser(payload.user);
  }

  if (isRecord(payload) && isRecord(payload.data) && "user" in payload.data) {
    return normalizeAuthUser(payload.data.user);
  }

  return normalizeAuthUser(payload);
};

const extractTeamName = (payload: unknown): string | undefined => {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(data) || !isRecord(data.team)) {
    return undefined;
  }

  return typeof data.team.teamName === "string" ? data.team.teamName : undefined;
};

export const authApi = {
  async register(payload: RegisterRequest): Promise<RegisterResult> {
    const response = await axiosInstance.post("/auth/register", payload);
    const normalizedPayload = unwrapApiEnvelope(response.data);

    return {
      session: extractSession(normalizedPayload),
      teamName: extractTeamName(normalizedPayload),
    };
  },

  async login(payload: LoginRequest): Promise<AuthSession> {
    const response = await axiosInstance.post("/auth/login", payload);
    return extractSession(unwrapApiEnvelope(response.data));
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  async logoutAll(): Promise<void> {
    await axiosInstance.post("/auth/logout-all");
  },

  async refresh(): Promise<string> {
    return requestTokenRefresh();
  },

  async me(options?: { skipAuthRefresh?: boolean }): Promise<AuthUser> {
    const response = await axiosInstance.get("/auth/me", {
      skipAuthRefresh: options?.skipAuthRefresh,
    });
    const payload = unwrapApiEnvelope(response.data);
    return extractUser(payload);
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await axiosInstance.patch("/auth/change-password", payload);
  },
};
