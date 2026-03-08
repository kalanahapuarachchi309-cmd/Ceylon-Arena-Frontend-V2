import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => (
  <div className={className}>
    <div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    {actions}
  </div>
);

export default PageHeader;
