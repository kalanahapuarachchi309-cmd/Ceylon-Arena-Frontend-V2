import type { ReactNode } from "react";

interface CustomFormSectionProps {
  title: string;
  children: ReactNode;
}

const CustomFormSection = ({ title, children }: CustomFormSectionProps) => (
  <section className="form-section">
    <h3 className="form-section-title">{title}</h3>
    {children}
  </section>
);

export default CustomFormSection;
