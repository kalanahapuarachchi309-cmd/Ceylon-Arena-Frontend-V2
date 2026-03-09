export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(message: string, type: ToastType, duration = 5000) {
    const toast: ToastMessage = {
      id: Date.now().toString() + Math.random(),
      message,
      type,
      duration,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string, duration?: number) {
    this.notify(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.notify(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.notify(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.notify(message, 'info', duration);
  }
}

export const toast = new ToastManager();
