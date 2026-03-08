import type { ApiSuccessResponse, PaginatedResponse } from "../types";

export type MaybeApiWrapped<T> = ApiSuccessResponse<T> | T;

export const unwrapApiData = <T>(payload: MaybeApiWrapped<T>): T => {
  if (typeof payload === "object" && payload !== null && "success" in payload && "data" in payload) {
    return (payload as ApiSuccessResponse<T>).data;
  }

  return payload as T;
};

export type ListResponse<T> = MaybeApiWrapped<PaginatedResponse<T>> | MaybeApiWrapped<T[]>;

