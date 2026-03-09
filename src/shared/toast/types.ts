export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ToastAriaLive = "polite" | "assertive";

export interface ToastCreateOptions {
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  duration?: number;
  autoDismiss?: boolean;
  dismissible?: boolean;
  dedupeKey?: string;
  allowDuplicates?: boolean;
  ariaLive?: ToastAriaLive;
}

export type ToastInput = string | ToastCreateOptions;

export interface ToastState {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  autoDismiss: boolean;
  dismissible: boolean;
  dedupeKey: string;
  ariaLive: ToastAriaLive;
  createdAt: number;
  exiting: boolean;
  paused: boolean;
}

export interface ToastUpdateInput {
  type?: ToastType;
  title?: string;
  message?: string;
  description?: string;
  duration?: number;
  autoDismiss?: boolean;
  dismissible?: boolean;
  dedupeKey?: string;
  allowDuplicates?: boolean;
  ariaLive?: ToastAriaLive;
}

export interface ToastPromiseMessages<T> {
  loading: ToastInput;
  success: ToastInput | ((value: T) => ToastInput);
  error: ToastInput | ((error: unknown) => ToastInput);
}

export type ToastMethodOptions = number | Partial<ToastCreateOptions>;

export interface ToastApi {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => ToastState[];
  show: (type: ToastType, input: ToastInput, options?: ToastMethodOptions) => string | null;
  success: (input: ToastInput, options?: ToastMethodOptions) => string | null;
  error: (input: ToastInput, options?: ToastMethodOptions) => string | null;
  warning: (input: ToastInput, options?: ToastMethodOptions) => string | null;
  info: (input: ToastInput, options?: ToastMethodOptions) => string | null;
  loading: (input: ToastInput, options?: ToastMethodOptions) => string | null;
  update: (id: string, update: ToastUpdateInput) => string | null;
  dismiss: (id?: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => Promise<T>;
}
