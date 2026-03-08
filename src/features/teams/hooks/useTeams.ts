import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { teamsApi } from "../api/teamsApi";
import type { TeamEntity, UpdateTeamRequest } from "../types/team.types";

interface UseMyTeamOptions {
  enabled?: boolean;
}

export const useMyTeam = ({ enabled = true }: UseMyTeamOptions = {}) => {
  const [team, setTeam] = useState<TeamEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      setError(null);
      setTeam(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await teamsApi.getMyTeam();
      setTeam(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback(async (payload: UpdateTeamRequest) => {
    const updatedTeam = await teamsApi.updateMyTeam(payload);
    setTeam(updatedTeam);
    return updatedTeam;
  }, []);

  return { team, isLoading, error, refetch: load, updateTeam: update };
};

export const useTeams = (params?: PaginationParams) => {
  const stableParams = useMemo<PaginationParams | undefined>(
    () =>
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        : undefined,
    [params?.limit, params?.page, params?.search, params?.sortBy, params?.sortOrder]
  );

  const [teams, setTeams] = useState<TeamEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await teamsApi.getTeams(stableParams);
      setTeams(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { teams, isLoading, error, refetch: load };
};
