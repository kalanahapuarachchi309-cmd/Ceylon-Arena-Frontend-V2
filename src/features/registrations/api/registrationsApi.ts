import { axiosInstance } from "../../../shared/api/axiosInstance";
import { unwrapApiData } from "../../../shared/api/apiTypes";
import type { PaginationParams } from "../../../shared/types";
import type {
  CreateRegistrationRequest,
  RegistrationEntity,
  UpdateRegistrationStatusRequest,
} from "../types/registration.types";

const toQueryString = (params?: PaginationParams) => {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const queryText = query.toString();
  return queryText ? `?${queryText}` : "";
};

const toRegistrations = (payload: unknown): RegistrationEntity[] => {
  if (Array.isArray(payload)) {
    return payload as RegistrationEntity[];
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as RegistrationEntity[];
    }
    if (Array.isArray(record.registrations)) {
      return record.registrations as RegistrationEntity[];
    }
  }
  return [];
};

export const registrationsApi = {
  async createRegistration(payload: CreateRegistrationRequest): Promise<RegistrationEntity> {
    const response = await axiosInstance.post("/registrations", payload);
    return unwrapApiData(response.data) as RegistrationEntity;
  },

  async getMyRegistrations(params?: PaginationParams): Promise<RegistrationEntity[]> {
    const response = await axiosInstance.get(`/registrations/my${toQueryString(params)}`);
    return toRegistrations(unwrapApiData(response.data));
  },

  async getRegistrationById(id: string): Promise<RegistrationEntity> {
    const response = await axiosInstance.get(`/registrations/${id}`);
    return unwrapApiData(response.data) as RegistrationEntity;
  },

  async getRegistrations(params?: PaginationParams): Promise<RegistrationEntity[]> {
    const response = await axiosInstance.get(`/registrations${toQueryString(params)}`);
    return toRegistrations(unwrapApiData(response.data));
  },

  async updateRegistrationStatus(
    id: string,
    payload: UpdateRegistrationStatusRequest
  ): Promise<RegistrationEntity> {
    const response = await axiosInstance.patch(`/registrations/${id}/status`, payload);
    return unwrapApiData(response.data) as RegistrationEntity;
  },
};

