import type { Event } from "../../../shared/types";
import type { EventStatus } from "../../../shared/types";

export interface CreateEventRequest {
  title: string;
  gameName: string;
  description: string;
  bannerImage?: string;
  rules?: string;
  entryFee: number;
  currency: string;
  maxTeams: number;
  registrationOpenAt: string;
  registrationCloseAt: string;
  eventStartAt: string;
  eventEndAt: string;
  status: EventStatus;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export type EventEntity = Event;
