import axios, {
  AxiosHeaders,
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "../../config/env";
import { clearAuthStorage, getAccessToken, setAccessToken } from "../lib/storage";
import { toast } from "../toast";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
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

const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && isRecord(error.response.data)) {
    const data = error.response.data;
    if (typeof data.message === "string") {
      return data.message;
    }
    if (typeof data.error === "string") {
      return data.error;
    }
  }
  return error.message || "An unexpected error occurred";
};

const handleHttpError = (error: AxiosError) => {
  const status = error.response?.status;
  const message = extractErrorMessage(error);

  switch (status) {
    case 429:
      toast.error("Too many requests. Please wait a moment and try again.", 6000);
      break;
    case 400:
      toast.error(message || "Invalid request. Please check your input.");
      break;
    case 403:
      toast.error(message || "You don't have permission to perform this action.");
      break;
    case 404:
      toast.error(message || "The requested resource was not found.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    case 503:
      toast.error("Service temporarily unavailable. Please try again later.");
      break;
    default:
      // For other errors, only show if it's not a 401 (handled separately)
      if (status !== 401) {
        toast.error(message);
      }
  }
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
let unauthorizedEventQueued = false;

const queueUnauthorizedEvent = () => {
  if (unauthorizedEventQueued) {
    return;
  }

  unauthorizedEventQueued = true;
  window.dispatchEvent(new Event("auth:unauthorized"));
  window.setTimeout(() => {
    unauthorizedEventQueued = false;
  }, 0);
};

const isAuthRefreshExcludedEndpoint = (requestUrl: string) =>
  requestUrl.includes("/auth/refresh") ||
  requestUrl.includes("/auth/login") ||
  requestUrl.includes("/auth/register") ||
  requestUrl.includes("/auth/logout") ||
  requestUrl.includes("/auth/logout-all");

const runRefresh = async () => {
  const refreshResponse = await refreshClient.post("/auth/refresh");
  const nextToken = extractAccessToken(refreshResponse.data);

  if (!nextToken) {
    throw new Error("Refresh response does not include access token.");
  }

  setAccessToken(nextToken);
  return nextToken;
};

export const requestTokenRefresh = async (): Promise<string> => {
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
      originalRequest.skipAuthRefresh === true ||
      isAuthRefreshExcludedEndpoint(requestUrl);

    if (shouldSkipRefresh) {
      // Handle other HTTP errors
      handleHttpError(error);
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextToken = await requestTokenRefresh();
      const retryHeaders = AxiosHeaders.from(originalRequest.headers);
      retryHeaders.set("Authorization", `Bearer ${nextToken}`);
      originalRequest.headers = retryHeaders;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      queueUnauthorizedEvent();
      return Promise.reject(refreshError);
    }
  }
);
