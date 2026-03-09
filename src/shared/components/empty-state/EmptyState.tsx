import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ title, description, action, className }: EmptyStateProps) => (
  <div className={className}>
    <h3>{title}</h3>
    {description ? <p>{description}</p> : null}
    {action}
  </div>
);

export default EmptyState;
