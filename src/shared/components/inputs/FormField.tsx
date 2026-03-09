import type { ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

const FormField = ({ label, htmlFor, children, error, className }: FormFieldProps) => (
  <div className={className}>
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error ? <p>{error}</p> : null}
  </div>
);

export default FormField;
