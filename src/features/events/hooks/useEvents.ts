import { useCallback, useEffect, useMemo, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";

interface UseEventsOptions {
  enabled?: boolean;
}

const PUBLIC_EVENTS_CACHE_TTL_MS = 60_000;
const ADMIN_EVENTS_CACHE_TTL_MS = 30_000;

interface EventCacheEntry {
  timestamp: number;
  data: EventEntity[];
}

const publicEventsCache = new Map<string, EventCacheEntry>();
const eventsCache = new Map<string, EventCacheEntry>();
const publicEventsInflight = new Map<string, Promise<EventEntity[]>>();
const eventsInflight = new Map<string, Promise<EventEntity[]>>();

const paramsKey = (params?: PaginationParams) =>
  JSON.stringify(params ?? {});

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
      const key = paramsKey(stableParams);
      const cacheEntry = publicEventsCache.get(key);
      const now = Date.now();
      if (cacheEntry && now - cacheEntry.timestamp < PUBLIC_EVENTS_CACHE_TTL_MS) {
        setEvents(cacheEntry.data);
        return;
      }

      let request = publicEventsInflight.get(key);
      if (!request) {
        request = eventsApi.getPublicEvents(stableParams);
        publicEventsInflight.set(key, request);
      }
      const result = await request;
      publicEventsCache.set(key, { data: result, timestamp: now });
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      publicEventsInflight.delete(paramsKey(stableParams));
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
      const key = paramsKey(stableParams);
      const cacheEntry = eventsCache.get(key);
      const now = Date.now();
      if (cacheEntry && now - cacheEntry.timestamp < ADMIN_EVENTS_CACHE_TTL_MS) {
        setEvents(cacheEntry.data);
        return;
      }

      let request = eventsInflight.get(key);
      if (!request) {
        request = eventsApi.getEvents(stableParams);
        eventsInflight.set(key, request);
      }
      const result = await request;
      eventsCache.set(key, { data: result, timestamp: now });
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      eventsInflight.delete(paramsKey(stableParams));
      setIsLoading(false);
    }
  }, [enabled, stableParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
};
