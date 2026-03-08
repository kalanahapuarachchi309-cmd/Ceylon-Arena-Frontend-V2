import { axiosInstance } from "../../../shared/api/axiosInstance";
import { env } from "../../../config/env";
import { unwrapApiData } from "../../../shared/api/apiTypes";

interface HealthPayload {
  status?: string;
  message?: string;
  uptime?: number;
  timestamp?: string;
}

export const healthApi = {
  async check(): Promise<HealthPayload> {
    const response = await axiosInstance.get("/health", {
      baseURL: new URL(env.apiBaseUrl).origin,
    });
    return unwrapApiData(response.data);
  },
};
