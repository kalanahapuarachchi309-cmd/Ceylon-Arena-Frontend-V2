import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "../../config/env";
import { clearAuthStorage, getAccessToken, setAccessToken } from "../lib/storage";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const extractAccessToken = (payload: unknown): string | null => {
  if (!isRecord(payload)) {
    return null;
  }

  if (typeof payload.accessToken === "string") {
    return payload.accessToken;
  }

  if (isRecord(payload.data) && typeof payload.data.accessToken === "string") {
    return payload.data.accessToken;
  }

  return null;
};

const baseHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: baseHeaders,
});

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: baseHeaders,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const runRefresh = async () => {
  const refreshResponse = await refreshClient.post("/auth/refresh");
  const nextToken = extractAccessToken(refreshResponse.data);

  if (!nextToken) {
    throw new Error("Refresh response does not include access token.");
  }

  setAccessToken(nextToken);
  return nextToken;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = runRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    const shouldSkipRefresh =
      !originalRequest ||
      status !== 401 ||
      originalRequest._retry ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (shouldSkipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextToken = await refreshAccessToken();
      const retryConfig: AxiosRequestConfig = {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${nextToken}`,
        },
      };
      return axiosInstance(retryConfig);
    } catch (refreshError) {
      clearAuthStorage();
      window.dispatchEvent(new Event("auth:unauthorized"));

      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/sign" && currentPath !== "/register") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    }
  }
);
