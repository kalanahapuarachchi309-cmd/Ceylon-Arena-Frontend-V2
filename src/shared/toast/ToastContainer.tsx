import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { toast } from "./toastStore";
import ToastItem from "./ToastItem";

import "./toast.css";

const ToastContainer = () => {
  const toasts = useSyncExternalStore(toast.subscribe, toast.getSnapshot, toast.getSnapshot);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  if (!portalTarget || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <section className="arena-toast-viewport" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toastItem) => (
        <ToastItem key={toastItem.id} toastItem={toastItem} />
      ))}
    </section>,
    portalTarget
  );
};

export default ToastContainer;
