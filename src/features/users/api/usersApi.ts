import { axiosInstance } from "../../../shared/api/axiosInstance";
import { extractList, unwrapApiData } from "../../../shared/api/apiTypes";
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

export const usersApi = {
  async getUsers(params?: PaginationParams): Promise<UserEntity[]> {
    const response = await axiosInstance.get(`/users${toQueryString(params)}`);
    return extractList<UserEntity>(unwrapApiData(response.data), ["users"]);
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
