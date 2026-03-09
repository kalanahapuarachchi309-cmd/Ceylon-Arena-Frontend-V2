interface ErrorStateProps {
  message: string;
  className?: string;
}

const ErrorState = ({ message, className }: ErrorStateProps) => <div className={className}>{message}</div>;

export default ErrorState;

