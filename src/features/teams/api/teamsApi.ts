import { axiosInstance } from "../../../shared/api/axiosInstance";
import { extractList, unwrapApiData } from "../../../shared/api/apiTypes";
import type { PaginationParams } from "../../../shared/types";
import type { TeamEntity, UpdateTeamRequest } from "../types/team.types";

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

export const teamsApi = {
  async getMyTeam(): Promise<TeamEntity | null> {
    const response = await axiosInstance.get("/teams/my-team");
    const payload = unwrapApiData(response.data);
    if (!payload) {
      return null;
    }
    return payload as TeamEntity;
  },

  async updateMyTeam(payload: UpdateTeamRequest): Promise<TeamEntity> {
    const response = await axiosInstance.patch("/teams/my-team", payload);
    return unwrapApiData(response.data) as TeamEntity;
  },

  async getTeams(params?: PaginationParams): Promise<TeamEntity[]> {
    const response = await axiosInstance.get(`/teams${toQueryString(params)}`);
    return extractList<TeamEntity>(unwrapApiData(response.data), ["teams"]);
  },

  async getTeamById(id: string): Promise<TeamEntity> {
    const response = await axiosInstance.get(`/teams/${id}`);
    return unwrapApiData(response.data) as TeamEntity;
  },
};
