import axios, { AxiosError } from "axios";

import type { ApiErrorResponse } from "../types";

export interface NormalizedApiError {
  message: string;
  errors?: Record<string, unknown>;
  statusCode?: number;
}

const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const payload = axiosError.response?.data;

    return {
      message: payload?.message ?? axiosError.message ?? FALLBACK_ERROR_MESSAGE,
      errors: payload?.errors,
      statusCode: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message || FALLBACK_ERROR_MESSAGE };
  }

  return { message: FALLBACK_ERROR_MESSAGE };
};

export const getErrorMessage = (error: unknown) => normalizeApiError(error).message;

