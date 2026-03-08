import { axiosInstance } from "../../../shared/api/axiosInstance";
import { unwrapApiData } from "../../../shared/api/apiTypes";
import type { PaginationParams } from "../../../shared/types";
import type { ChangeUserRoleRequest, ChangeUserStatusRequest, UserEntity } from "../types/user.types";

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

const toUsers = (payload: unknown): UserEntity[] => {
  if (Array.isArray(payload)) {
    return payload as UserEntity[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as UserEntity[];
    }
    if (Array.isArray(record.users)) {
      return record.users as UserEntity[];
    }
  }

  return [];
};

export const usersApi = {
  async getUsers(params?: PaginationParams): Promise<UserEntity[]> {
    const response = await axiosInstance.get(`/users${toQueryString(params)}`);
    return toUsers(unwrapApiData(response.data));
  },

  async getUserById(id: string): Promise<UserEntity> {
    const response = await axiosInstance.get(`/users/${id}`);
    return unwrapApiData(response.data) as UserEntity;
  },

  async changeUserRole(id: string, payload: ChangeUserRoleRequest): Promise<UserEntity> {
    const response = await axiosInstance.patch(`/users/${id}/role`, payload);
    return unwrapApiData(response.data) as UserEntity;
  },

  async changeUserStatus(id: string, payload: ChangeUserStatusRequest): Promise<UserEntity> {
    const response = await axiosInstance.patch(`/users/${id}/status`, payload);
    return unwrapApiData(response.data) as UserEntity;
  },
};

