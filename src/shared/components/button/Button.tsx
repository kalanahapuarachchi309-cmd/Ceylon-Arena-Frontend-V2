import type { ButtonHTMLAttributes } from "react";

const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

export default Button;

