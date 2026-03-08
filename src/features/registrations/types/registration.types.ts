import type { EventRegistration } from "../../../shared/types";
import type { RegistrationStatus } from "../../../shared/types";

export interface CreateRegistrationRequest {
  eventId: string;
}

export interface UpdateRegistrationStatusRequest {
  status: RegistrationStatus;
  notes?: string;
}

export type RegistrationEntity = EventRegistration;
