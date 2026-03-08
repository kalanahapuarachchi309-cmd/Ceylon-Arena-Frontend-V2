import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react";

import { toast } from "../utils/toast";

interface CustomToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const CustomToastContext = createContext<CustomToastContextValue | null>(null);

export const CustomToastProvider = ({ children }: PropsWithChildren) => {
  const success = useCallback((message: string, duration?: number) => {
    toast.success(message, duration);
  }, []);

  const error = useCallback((message: string, duration?: number) => {
    toast.error(message, duration);
  }, []);

  const warning = useCallback((message: string, duration?: number) => {
    toast.warning(message, duration);
  }, []);

  const info = useCallback((message: string, duration?: number) => {
    toast.info(message, duration);
  }, []);

  const value = useMemo<CustomToastContextValue>(
    () => ({ success, error, warning, info }),
    [error, info, success, warning]
  );

  return <CustomToastContext.Provider value={value}>{children}</CustomToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(CustomToastContext);
  if (!context) {
    throw new Error("useToast must be used within CustomToastProvider");
  }

  return context;
};
