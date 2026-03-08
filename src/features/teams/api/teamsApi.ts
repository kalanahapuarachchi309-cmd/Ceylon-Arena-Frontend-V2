import { axiosInstance } from "../../../shared/api/axiosInstance";
import { unwrapApiData } from "../../../shared/api/apiTypes";
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

const toTeams = (payload: unknown): TeamEntity[] => {
  if (Array.isArray(payload)) {
    return payload as TeamEntity[];
  }
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as TeamEntity[];
    }
    if (Array.isArray(record.teams)) {
      return record.teams as TeamEntity[];
    }
  }
  return [];
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
    return toTeams(unwrapApiData(response.data));
  },

  async getTeamById(id: string): Promise<TeamEntity> {
    const response = await axiosInstance.get(`/teams/${id}`);
    return unwrapApiData(response.data) as TeamEntity;
  },
};

