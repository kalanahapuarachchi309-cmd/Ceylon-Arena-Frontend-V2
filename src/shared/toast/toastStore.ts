import type {
  ToastApi,
  ToastAriaLive,
  ToastCreateOptions,
  ToastInput,
  ToastMethodOptions,
  ToastPromiseMessages,
  ToastState,
  ToastType,
  ToastUpdateInput,
} from "./types";

const DEFAULT_DURATION_MS = 5000;
const EXIT_ANIMATION_MS = 240;
const MAX_VISIBLE_TOASTS = 4;
const DEDUPE_WINDOW_MS = 2500;
const DEDUPE_TTL_MS = 60_000;

interface AutoDismissTimer {
  timeoutId: number | null;
  remaining: number;
  startedAt: number;
  paused: boolean;
}

interface NormalizedToastPayload {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  autoDismiss: boolean;
  dismissible: boolean;
  dedupeKey: string;
  allowDuplicates: boolean;
  ariaLive: ToastAriaLive;
}

const fallbackMessageByType: Record<ToastType, string> = {
  success: "Action completed successfully.",
  error: "Something went wrong. Please try again.",
  warning: "Please review this action.",
  info: "Here is an update.",
  loading: "Processing...",
};

const trimOrUndefined = (value?: string) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeMethodOptions = (options?: ToastMethodOptions): Partial<ToastCreateOptions> =>
  typeof options === "number" ? { duration: options } : options ?? {};

class ToastStore implements ToastApi {
  private toasts: ToastState[] = [];

  private queue: ToastState[] = [];

  private listeners = new Set<() => void>();

  private autoDismissTimers = new Map<string, AutoDismissTimer>();

  private exitTimers = new Map<string, number>();

  private dedupeHistory = new Map<string, number>();

  private sequence = 0;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.toasts;

  show = (type: ToastType, input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue(type, input, normalizeMethodOptions(options));

  success = (input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue("success", input, normalizeMethodOptions(options));

  error = (input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue("error", input, normalizeMethodOptions(options));

  warning = (input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue("warning", input, normalizeMethodOptions(options));

  info = (input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue("info", input, normalizeMethodOptions(options));

  loading = (input: ToastInput, options?: ToastMethodOptions) =>
    this.enqueue("loading", input, {
      autoDismiss: false,
      dismissible: false,
      ...normalizeMethodOptions(options),
    });

  update = (id: string, update: ToastUpdateInput) => {
    const activeIndex = this.toasts.findIndex((item) => item.id === id);
    if (activeIndex >= 0) {
      const current = this.toasts[activeIndex];
      const next = this.applyUpdate(current, update);

      this.clearExitTimer(id);
      this.clearAutoDismissTimer(id);

      this.toasts = this.toasts.map((item) => (item.id === id ? next : item));
      if (next.autoDismiss) {
        this.scheduleAutoDismiss(next);
      }
      this.emit();
      return id;
    }

    const queuedIndex = this.queue.findIndex((item) => item.id === id);
    if (queuedIndex >= 0) {
      const current = this.queue[queuedIndex];
      const next = this.applyUpdate(current, update);
      this.queue = this.queue.map((item) => (item.id === id ? next : item));
      return id;
    }

    return null;
  };

  dismiss = (id?: string) => {
    if (!id) {
      this.queue = [];
      const openToastIds = this.toasts.filter((item) => !item.exiting).map((item) => item.id);
      if (openToastIds.length === 0) {
        return;
      }

      this.toasts = this.toasts.map((item) => (item.exiting ? item : { ...item, exiting: true, paused: false }));
      openToastIds.forEach((toastId) => {
        this.clearAutoDismissTimer(toastId);
        this.scheduleExit(toastId);
      });
      this.emit();
      return;
    }

    const activeToast = this.toasts.find((item) => item.id === id);
    if (!activeToast) {
      const initialQueueSize = this.queue.length;
      this.queue = this.queue.filter((item) => item.id !== id);
      this.clearAutoDismissTimer(id);
      this.clearExitTimer(id);
      if (this.queue.length !== initialQueueSize) {
        this.emit();
      }
      return;
    }

    if (activeToast.exiting) {
      return;
    }

    this.toasts = this.toasts.map((item) =>
      item.id === id
        ? {
            ...item,
            exiting: true,
            paused: false,
          }
        : item
    );
    this.clearAutoDismissTimer(id);
    this.scheduleExit(id);
    this.emit();
  };

  pause = (id: string) => {
    const timer = this.autoDismissTimers.get(id);
    if (!timer || timer.paused || timer.timeoutId === null) {
      return;
    }

    window.clearTimeout(timer.timeoutId);
    const elapsed = Date.now() - timer.startedAt;
    const remaining = Math.max(0, timer.remaining - elapsed);
    this.autoDismissTimers.set(id, {
      timeoutId: null,
      remaining,
      startedAt: Date.now(),
      paused: true,
    });
    this.setPausedState(id, true);
  };

  resume = (id: string) => {
    const timer = this.autoDismissTimers.get(id);
    if (!timer || !timer.paused) {
      return;
    }

    if (timer.remaining <= 0) {
      this.dismiss(id);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      this.dismiss(id);
    }, timer.remaining);

    this.autoDismissTimers.set(id, {
      timeoutId,
      remaining: timer.remaining,
      startedAt: Date.now(),
      paused: false,
    });
    this.setPausedState(id, false);
  };

  promise = async <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => {
    const loadingToastId = this.loading(messages.loading, { allowDuplicates: true });

    try {
      const value = await promise;
      const successInput = typeof messages.success === "function" ? messages.success(value) : messages.success;
      const successUpdate = this.asUpdatePayload("success", successInput);
      if (loadingToastId) {
        this.update(loadingToastId, {
          ...successUpdate,
          duration: successUpdate.duration ?? DEFAULT_DURATION_MS,
          autoDismiss: true,
          dismissible: true,
        });
      } else {
        this.success(successInput);
      }
      return value;
    } catch (error) {
      const errorInput = typeof messages.error === "function" ? messages.error(error) : messages.error;
      const errorUpdate = this.asUpdatePayload("error", errorInput);
      if (loadingToastId) {
        this.update(loadingToastId, {
          ...errorUpdate,
          duration: errorUpdate.duration ?? DEFAULT_DURATION_MS,
          autoDismiss: true,
          dismissible: true,
        });
      } else {
        this.error(errorInput);
      }
      throw error;
    }
  };

  private enqueue = (type: ToastType, input: ToastInput, overrides: Partial<ToastCreateOptions>) => {
    const payload = this.normalizeToastPayload(type, input, overrides);

    if (!payload.allowDuplicates) {
      const existingId = this.findExistingToastId(payload.dedupeKey);
      if (existingId) {
        return existingId;
      }

      const recentDuplicateAt = this.dedupeHistory.get(payload.dedupeKey);
      if (typeof recentDuplicateAt === "number" && Date.now() - recentDuplicateAt < DEDUPE_WINDOW_MS) {
        return null;
      }
    }

    this.pruneDedupeHistory();
    this.dedupeHistory.set(payload.dedupeKey, Date.now());

    const nextToast: ToastState = {
      id: payload.id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      duration: payload.duration,
      autoDismiss: payload.autoDismiss,
      dismissible: payload.dismissible,
      dedupeKey: payload.dedupeKey,
      ariaLive: payload.ariaLive,
      createdAt: Date.now(),
      exiting: false,
      paused: false,
    };

    if (this.toasts.length >= MAX_VISIBLE_TOASTS) {
      this.queue = [...this.queue, nextToast];
    } else {
      this.toasts = [...this.toasts, nextToast];
      this.scheduleAutoDismiss(nextToast);
    }

    this.emit();
    return nextToast.id;
  };

  private normalizeToastPayload = (
    type: ToastType,
    input: ToastInput,
    overrides: Partial<ToastCreateOptions>
  ): NormalizedToastPayload => {
    const baseInput = typeof input === "string" ? { message: input } : input;
    const merged = { ...baseInput, ...overrides };

    const title = trimOrUndefined(merged.title);
    const message =
      trimOrUndefined(merged.message) ??
      trimOrUndefined(merged.description) ??
      title ??
      fallbackMessageByType[type];

    const durationCandidate =
      typeof merged.duration === "number" ? merged.duration : type === "loading" ? 0 : DEFAULT_DURATION_MS;
    const duration = Math.max(0, Number(durationCandidate) || 0);

    const autoDismissCandidate = merged.autoDismiss ?? type !== "loading";
    const autoDismiss = autoDismissCandidate && duration > 0;
    const dismissible = merged.dismissible ?? true;

    const ariaLive: ToastAriaLive = merged.ariaLive ?? (type === "error" ? "assertive" : "polite");

    const dedupeKey = (
      trimOrUndefined(merged.dedupeKey) ?? `${type}:${title ?? ""}:${message}`
    ).toLowerCase();

    return {
      id: trimOrUndefined(merged.id) ?? this.createId(),
      type,
      title,
      message,
      duration,
      autoDismiss,
      dismissible,
      dedupeKey,
      allowDuplicates: merged.allowDuplicates ?? false,
      ariaLive,
    };
  };

  private asUpdatePayload = (type: ToastType, input: ToastInput): ToastUpdateInput => {
    if (typeof input === "string") {
      return { type, message: input };
    }

    return {
      type,
      title: input.title,
      message: input.message ?? input.description,
      duration: input.duration,
      autoDismiss: input.autoDismiss,
      dismissible: input.dismissible,
      dedupeKey: input.dedupeKey,
      allowDuplicates: input.allowDuplicates,
      ariaLive: input.ariaLive,
    };
  };

  private applyUpdate = (current: ToastState, update: ToastUpdateInput): ToastState => {
    const nextType = update.type ?? current.type;
    const nextTitle =
      update.title === undefined
        ? current.title
        : trimOrUndefined(update.title);

    const explicitMessage = update.message ?? update.description;
    const nextMessage =
      explicitMessage === undefined
        ? current.message
        : trimOrUndefined(explicitMessage) ?? fallbackMessageByType[nextType];

    const nextDuration =
      update.duration === undefined
        ? current.duration
        : Math.max(0, Number(update.duration) || 0);

    const autoDismissCandidate = update.autoDismiss ?? current.autoDismiss;
    const nextAutoDismiss = autoDismissCandidate && nextDuration > 0;

    const nextDedupeKey = (trimOrUndefined(update.dedupeKey) ?? current.dedupeKey).toLowerCase();

    return {
      ...current,
      type: nextType,
      title: nextTitle,
      message: nextMessage,
      duration: nextDuration,
      autoDismiss: nextAutoDismiss,
      dismissible: update.dismissible ?? current.dismissible,
      dedupeKey: nextDedupeKey,
      ariaLive: update.ariaLive ?? (nextType === "error" ? "assertive" : current.ariaLive),
      exiting: false,
      paused: false,
    };
  };

  private scheduleAutoDismiss = (toastItem: ToastState) => {
    if (!toastItem.autoDismiss || toastItem.duration <= 0) {
      this.clearAutoDismissTimer(toastItem.id);
      return;
    }

    this.clearAutoDismissTimer(toastItem.id);
    const timeoutId = window.setTimeout(() => {
      this.dismiss(toastItem.id);
    }, toastItem.duration);

    this.autoDismissTimers.set(toastItem.id, {
      timeoutId,
      remaining: toastItem.duration,
      startedAt: Date.now(),
      paused: false,
    });
  };

  private scheduleExit = (id: string) => {
    this.clearExitTimer(id);
    const timerId = window.setTimeout(() => {
      const initialLength = this.toasts.length;
      this.toasts = this.toasts.filter((item) => item.id !== id);
      this.clearAutoDismissTimer(id);
      this.clearExitTimer(id);

      if (initialLength === this.toasts.length) {
        return;
      }

      let changed = false;
      while (this.toasts.length < MAX_VISIBLE_TOASTS && this.queue.length > 0) {
        const [next, ...rest] = this.queue;
        this.queue = rest;
        this.toasts = [...this.toasts, next];
        this.scheduleAutoDismiss(next);
        changed = true;
      }

      if (changed || initialLength !== this.toasts.length) {
        this.emit();
      }
    }, EXIT_ANIMATION_MS);

    this.exitTimers.set(id, timerId);
  };

  private clearAutoDismissTimer = (id: string) => {
    const timer = this.autoDismissTimers.get(id);
    if (!timer) {
      return;
    }

    if (timer.timeoutId !== null) {
      window.clearTimeout(timer.timeoutId);
    }

    this.autoDismissTimers.delete(id);
  };

  private clearExitTimer = (id: string) => {
    const timerId = this.exitTimers.get(id);
    if (typeof timerId === "number") {
      window.clearTimeout(timerId);
    }
    this.exitTimers.delete(id);
  };

  private setPausedState = (id: string, paused: boolean) => {
    let changed = false;
    this.toasts = this.toasts.map((item) => {
      if (item.id !== id || item.paused === paused) {
        return item;
      }
      changed = true;
      return { ...item, paused };
    });

    if (changed) {
      this.emit();
    }
  };

  private findExistingToastId = (dedupeKey: string) => {
    const active = this.toasts.find((item) => item.dedupeKey === dedupeKey && !item.exiting);
    if (active) {
      return active.id;
    }

    const queued = this.queue.find((item) => item.dedupeKey === dedupeKey);
    return queued?.id ?? null;
  };

  private createId = () => {
    this.sequence += 1;
    return `toast-${Date.now()}-${this.sequence}`;
  };

  private pruneDedupeHistory = () => {
    if (this.dedupeHistory.size < 250) {
      return;
    }

    const cutoff = Date.now() - DEDUPE_TTL_MS;
    this.dedupeHistory.forEach((timestamp, key) => {
      if (timestamp < cutoff) {
        this.dedupeHistory.delete(key);
      }
    });
  };

  private emit = () => {
    this.listeners.forEach((listener) => listener());
  };
}

export const toast = new ToastStore();
