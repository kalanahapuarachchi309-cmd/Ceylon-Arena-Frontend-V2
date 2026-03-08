import { useCallback, useEffect, useState } from "react";

import type { PaginationParams } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";

export const usePublicEvents = (params?: PaginationParams) => {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await eventsApi.getPublicEvents(params);
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
};

export const useEvents = (params?: PaginationParams) => {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await eventsApi.getEvents(params);
      setEvents(result);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
};

