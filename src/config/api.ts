const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    REGISTER_WITH_BANK: `${API_BASE_URL}/users/register-with-bank-payment`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    ME: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  PAYMENTS: {
    LIST: `${API_BASE_URL}/payments`,
    CARD: `${API_BASE_URL}/payments/submit`,
    BANK: `${API_BASE_URL}/payments/submit`,
    STATUS: (id: string) => `${API_BASE_URL}/payments/${id}/review`,
    DELETE: (id: string) => `${API_BASE_URL}/payments/${id}`,
  },
  REGISTRATIONS: {
    LIST: `${API_BASE_URL}/registrations`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/registrations/${id}`,
  },
};
