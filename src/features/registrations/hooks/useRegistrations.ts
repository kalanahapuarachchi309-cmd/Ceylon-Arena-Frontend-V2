import { useCallback, useEffect, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { registrationsApi } from "../api/registrationsApi";
import type { CreateRegistrationRequest, RegistrationEntity } from "../types/registration.types";

export const useMyRegistrations = (params?: PaginationParams) => {
  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await registrationsApi.getMyRegistrations(params);
      setRegistrations(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (payload: CreateRegistrationRequest) => {
    const created = await registrationsApi.createRegistration(payload);
    setRegistrations((prev) => [created, ...prev]);
    return created;
  }, []);

  return { registrations, isLoading, error, refetch: load, createRegistration: create };
};

export const useRegistrations = (params?: PaginationParams) => {
  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await registrationsApi.getRegistrations(params);
      setRegistrations(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  return { registrations, isLoading, error, refetch: load };
};

