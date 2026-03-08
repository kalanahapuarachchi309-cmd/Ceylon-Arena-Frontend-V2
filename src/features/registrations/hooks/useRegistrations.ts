import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { registrationsApi } from "../api/registrationsApi";
import type { CreateRegistrationRequest, RegistrationEntity } from "../types/registration.types";

interface UseMyRegistrationsOptions {
  enabled?: boolean;
}

const MY_REGISTRATIONS_CACHE_TTL_MS = 20_000;
const myRegistrationsCache = new Map<
  string,
  { data: RegistrationEntity[]; timestamp: number }
>();
const myRegistrationsInflight = new Map<string, Promise<RegistrationEntity[]>>();

const paramsKey = (params?: PaginationParams) => JSON.stringify(params ?? {});

export const useMyRegistrations = (
  params?: PaginationParams,
  { enabled = true }: UseMyRegistrationsOptions = {}
) => {
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

  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setRegistrations([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const key = paramsKey(stableParams);
      const now = Date.now();
      const cacheEntry = myRegistrationsCache.get(key);
      if (cacheEntry && now - cacheEntry.timestamp < MY_REGISTRATIONS_CACHE_TTL_MS) {
        setRegistrations(cacheEntry.data);
        return;
      }

      let request = myRegistrationsInflight.get(key);
      if (!request) {
        request = registrationsApi.getMyRegistrations(stableParams);
        myRegistrationsInflight.set(key, request);
      }
      const result = await request;
      myRegistrationsCache.set(key, { data: result, timestamp: now });
      setRegistrations(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      myRegistrationsInflight.delete(paramsKey(stableParams));
      setIsLoading(false);
    }
  }, [enabled, stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (payload: CreateRegistrationRequest) => {
    const created = await registrationsApi.createRegistration(payload);
    myRegistrationsCache.clear();
    setRegistrations((prev) => [created, ...prev]);
    return created;
  }, []);

  return { registrations, isLoading, error, refetch: load, createRegistration: create };
};

export const useRegistrations = (params?: PaginationParams) => {
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

  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await registrationsApi.getRegistrations(stableParams);
      setRegistrations(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { registrations, isLoading, error, refetch: load };
};
