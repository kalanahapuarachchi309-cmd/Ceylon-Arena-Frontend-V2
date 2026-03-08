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

type RefreshResponse = {
  accessToken?: string;
  data?: {
    accessToken?: string;
  };
};

const resolveAccessToken = (payload: RefreshResponse) =>
  payload?.data?.accessToken ?? payload?.accessToken ?? null;

const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    const responseStatus = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    if (!originalRequest || responseStatus !== 401 || originalRequest._retry || requestUrl.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await refreshClient.post<RefreshResponse>("/auth/refresh");
      const nextToken = resolveAccessToken(refreshResponse.data);

      if (!nextToken) {
        throw new Error("No access token in refresh response");
      }

      setAccessToken(nextToken);

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

