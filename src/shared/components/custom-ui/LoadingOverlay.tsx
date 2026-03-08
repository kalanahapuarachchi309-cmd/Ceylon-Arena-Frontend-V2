import "./custom-ui.css";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay = ({ isVisible, message = "Loading..." }: LoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="custom-loading-overlay" role="status" aria-live="polite">
      <div className="custom-loading-panel">
        <div className="custom-loading-spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
