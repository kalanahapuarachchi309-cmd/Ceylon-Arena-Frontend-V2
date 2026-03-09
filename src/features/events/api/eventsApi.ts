import { axiosInstance } from "../../../shared/api/axiosInstance";
import { extractList, unwrapApiData } from "../../../shared/api/apiTypes";
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

export const eventsApi = {
  async getPublicEvents(params?: PaginationParams): Promise<EventEntity[]> {
    const response = await axiosInstance.get(`/events/public${toQueryString(params)}`);
    return extractList<EventEntity>(unwrapApiData(response.data), ["items"]);
  },

  async getPublicEventBySlug(slug: string): Promise<EventEntity> {
    const response = await axiosInstance.get(`/events/public/${slug}`);
    return unwrapApiData(response.data) as EventEntity;
  },

  async getEvents(params?: PaginationParams): Promise<EventEntity[]> {
    const response = await axiosInstance.get(`/events${toQueryString(params)}`);
    return extractList<EventEntity>(unwrapApiData(response.data), ["items"]);
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
