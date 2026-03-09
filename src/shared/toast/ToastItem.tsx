import type { KeyboardEvent } from "react";
import { AlertTriangle, CheckCircle2, Info, LoaderCircle, X, XCircle } from "lucide-react";

import { toast } from "./toastStore";
import type { ToastState } from "./types";

interface ToastItemProps {
  toastItem: ToastState;
}

const iconByType = {
  success: <CheckCircle2 size={32} />,
  error: <XCircle size={32} />,
  warning: <AlertTriangle size={32} />,
  info: <Info size={32} />,
  loading: <LoaderCircle size={32} className="arena-toast__spinner" />,
};

const ToastItem = ({ toastItem }: ToastItemProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!toastItem.dismissible) {
      return;
    }

    if (event.key === "Escape" || event.key === "Delete") {
      event.preventDefault();
      toast.dismiss(toastItem.id);
    }
  };

  return (
    <article
      className={`arena-toast arena-toast--${toastItem.type}${toastItem.exiting ? " arena-toast--exiting" : ""}`}
      role={toastItem.type === "error" ? "alert" : "status"}
      aria-live={toastItem.ariaLive}
      tabIndex={0}
      onMouseEnter={() => toast.pause(toastItem.id)}
      onMouseLeave={() => toast.resume(toastItem.id)}
      onFocus={() => toast.pause(toastItem.id)}
      onBlur={() => toast.resume(toastItem.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Left colored accent border */}
      <span className="arena-toast__accent" aria-hidden="true" />
      
      {/* Close button - absolutely positioned top-right */}
      {toastItem.dismissible ? (
        <button
          type="button"
          className="arena-toast__close"
          aria-label="Close notification"
          onClick={() => toast.dismiss(toastItem.id)}
        >
          <X size={20} />
        </button>
      ) : null}
      
      {/* Main horizontal layout: Icon box + Content */}
      <div className="arena-toast__main">
        {/* Large square icon container */}
        <div className="arena-toast__icon-box" aria-hidden="true">
          <span className="arena-toast__icon">
            {iconByType[toastItem.type]}
          </span>
        </div>

        {/* Text content area */}
        <div className="arena-toast__content">
          {toastItem.title ? <p className="arena-toast__title">{toastItem.title}</p> : null}
          <p className="arena-toast__message">{toastItem.message}</p>
        </div>
      </div>

      {/* Progress bar under everything */}
      {toastItem.autoDismiss ? (
        <span className="arena-toast__progress" aria-hidden="true">
          <span
            className="arena-toast__progress-bar"
            style={{
              animationDuration: `${toastItem.duration}ms`,
              animationPlayState: toastItem.paused ? "paused" : "running",
            }}
          />
        </span>
      ) : null}
    </article>
  );
};

export default ToastItem;
