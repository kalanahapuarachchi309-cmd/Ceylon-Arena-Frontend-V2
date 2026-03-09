interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({ message = "Loading...", className }: LoadingStateProps) => (
  <div className={className}>{message}</div>
);

export default LoadingState;

