import type { ApiSuccessResponse, PaginationMeta } from "../types";

type AnyRecord = Record<string, unknown>;

export type MaybeApiWrapped<T> = ApiSuccessResponse<T> | T;

const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === "object" && value !== null;

const isSuccessEnvelope = <T>(value: unknown): value is ApiSuccessResponse<T> =>
  isRecord(value) && value.success === true && "data" in value;

export const unwrapApiData = <T>(payload: MaybeApiWrapped<T>): T =>
  isSuccessEnvelope<T>(payload) ? payload.data : (payload as T);

const DEFAULT_LIST_KEYS = [
  "items",
  "data",
  "docs",
  "events",
  "users",
  "teams",
  "registrations",
  "payments",
] as const;

export const extractList = <T>(payload: unknown, preferredKeys: string[] = []): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of [...preferredKeys, ...DEFAULT_LIST_KEYS]) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
};

const toMeta = (payload: AnyRecord): PaginationMeta | undefined => {
  const rawMeta = (isRecord(payload.meta) ? payload.meta : payload.pagination) as AnyRecord | undefined;

  if (rawMeta) {
    const page = Number(rawMeta.page);
    const limit = Number(rawMeta.limit);
    const total = Number(rawMeta.total);
    const totalPages = Number(rawMeta.totalPages);

    if ([page, limit, total, totalPages].every((value) => Number.isFinite(value))) {
      return { page, limit, total, totalPages };
    }
  }

  const page = Number(payload.page);
  const limit = Number(payload.limit);
  const total = Number(payload.total);
  const totalPages = Number(payload.totalPages);

  if ([page, limit, total, totalPages].every((value) => Number.isFinite(value))) {
    return { page, limit, total, totalPages };
  }

  return undefined;
};

export interface ListResult<T> {
  items: T[];
  meta?: PaginationMeta;
}

export const extractListResult = <T>(payload: unknown, preferredKeys: string[] = []): ListResult<T> => {
  if (!isRecord(payload)) {
    return { items: extractList<T>(payload, preferredKeys) };
  }

  return {
    items: extractList<T>(payload, preferredKeys),
    meta: toMeta(payload),
  };
};

export const resolveEntityId = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.id === "string") {
    return value.id;
  }

  if (typeof value._id === "string") {
    return value._id;
  }

  return null;
};
