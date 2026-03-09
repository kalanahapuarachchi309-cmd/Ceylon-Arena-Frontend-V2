/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

import ToastContainer from "./ToastContainer";
import { toast } from "./toastStore";
import type { ToastApi } from "./types";

const ToastContext = createContext<ToastApi | null>(null);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const value = useMemo<ToastApi>(() => toast, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
