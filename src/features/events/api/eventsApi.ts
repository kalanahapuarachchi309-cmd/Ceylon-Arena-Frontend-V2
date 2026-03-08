import { axiosInstance } from "../../../shared/api/axiosInstance";
import { unwrapApiData } from "../../../shared/api/apiTypes";
import type { PaginationParams } from "../../../shared/types";
import type { CreateEventRequest, EventEntity, UpdateEventRequest } from "../types/event.types";

const toQueryString = (params?: PaginationParams) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const toArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as T[];
    }
    if (Array.isArray(record.events)) {
      return record.events as T[];
    }
  }

  return [];
};

export const eventsApi = {
  async getPublicEvents(params?: PaginationParams): Promise<EventEntity[]> {
    const response = await axiosInstance.get(`/events/public${toQueryString(params)}`);
    return toArray<EventEntity>(unwrapApiData(response.data));
  },

  async getPublicEventBySlug(slug: string): Promise<EventEntity> {
    const response = await axiosInstance.get(`/events/public/${slug}`);
    return unwrapApiData(response.data) as EventEntity;
  },

  async getEvents(params?: PaginationParams): Promise<EventEntity[]> {
    const response = await axiosInstance.get(`/events${toQueryString(params)}`);
    return toArray<EventEntity>(unwrapApiData(response.data));
  },

  async getEventById(id: string): Promise<EventEntity> {
    const response = await axiosInstance.get(`/events/${id}`);
    return unwrapApiData(response.data) as EventEntity;
  },

  async createEvent(payload: CreateEventRequest): Promise<EventEntity> {
    const response = await axiosInstance.post("/events", payload);
    return unwrapApiData(response.data) as EventEntity;
  },

  async updateEvent(id: string, payload: UpdateEventRequest): Promise<EventEntity> {
    const response = await axiosInstance.patch(`/events/${id}`, payload);
    return unwrapApiData(response.data) as EventEntity;
  },

  async deleteEvent(id: string): Promise<void> {
    await axiosInstance.delete(`/events/${id}`);
  },
};

