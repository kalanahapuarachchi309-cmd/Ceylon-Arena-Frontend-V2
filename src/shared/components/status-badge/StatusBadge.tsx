import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

interface StatusBadgeProps {
  status: string;
  className?: string;
  children?: ReactNode;
}

const StatusBadge = ({ status, className, children }: StatusBadgeProps) => (
  <span className={cn("status-badge", status.toLowerCase(), className)}>
    {children ?? status}
  </span>
);

export default StatusBadge;
