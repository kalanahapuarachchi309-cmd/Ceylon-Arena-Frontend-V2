import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";

interface UseEventsOptions {
  enabled?: boolean;
}

export const usePublicEvents = (
  params?: PaginationParams,
  { enabled = true }: UseEventsOptions = {}
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

  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setEvents([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await eventsApi.getPublicEvents(stableParams);
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
};

export const useEvents = (
  params?: PaginationParams,
  { enabled = true }: UseEventsOptions = {}
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

  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setEvents([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await eventsApi.getEvents(stableParams);
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
};
