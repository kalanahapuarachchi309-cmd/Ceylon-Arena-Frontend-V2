import type { PaginationMeta } from "./common";

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  docs?: T[];
  events?: T[];
  users?: T[];
  teams?: T[];
  registrations?: T[];
  payments?: T[];
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
