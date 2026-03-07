export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ceylon-arena-gamming-web-site-back.vercel.app';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/api/v1/users/register`,
    REGISTER_WITH_BANK: `${API_BASE_URL}/api/v1/users/register-with-bank-payment`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/users/me/${id}`,
  },
  PAYMENTS: {
    LIST: `${API_BASE_URL}/api/v1/payments`,
    CARD: `${API_BASE_URL}/api/v1/payments/card`,
    BANK: `${API_BASE_URL}/api/v1/payments/bank`,
  },
};