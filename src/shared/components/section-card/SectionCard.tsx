import type { ReactNode } from "react";

interface SectionCardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

const SectionCard = ({ title, children, className }: SectionCardProps) => (
  <div className={className}>
    {title ? <h3>{title}</h3> : null}
    {children}
  </div>
);

export default SectionCard;
