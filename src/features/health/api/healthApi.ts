import { axiosInstance } from "../../../shared/api/axiosInstance";
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
      baseURL: "http://localhost:5000",
    });
    return unwrapApiData(response.data);
  },
};
