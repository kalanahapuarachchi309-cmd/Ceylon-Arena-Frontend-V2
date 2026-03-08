const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const env = {
  apiBaseUrl: normalizeBaseUrl(rawBaseUrl),
  appName: import.meta.env.VITE_APP_NAME ?? "Ceylon Arena",
} as const;

