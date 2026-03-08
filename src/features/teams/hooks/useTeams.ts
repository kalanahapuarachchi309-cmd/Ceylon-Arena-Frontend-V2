import { useCallback, useEffect, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { teamsApi } from "../api/teamsApi";
import type { TeamEntity, UpdateTeamRequest } from "../types/team.types";

export const useMyTeam = () => {
  const [team, setTeam] = useState<TeamEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
  }, []);

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
  const [teams, setTeams] = useState<TeamEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await teamsApi.getTeams(params);
      setTeams(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  return { teams, isLoading, error, refetch: load };
};

