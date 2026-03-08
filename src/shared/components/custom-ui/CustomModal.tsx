import { type ReactNode } from "react";

import "./custom-ui.css";

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: number;
}

const CustomModal = ({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  actions,
  maxWidth = 880,
}: CustomModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(event) => event.stopPropagation()} style={{ maxWidth }}>
        <button className="custom-modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="custom-modal-header">
          <h3 className="custom-modal-title">{title}</h3>
          {subtitle ? <p className="custom-modal-subtitle">{subtitle}</p> : null}
        </div>
        <div className="custom-modal-content">{children}</div>
        {actions ? <div className="custom-modal-actions">{actions}</div> : null}
      </div>
    </div>
  );
};

export default CustomModal;
