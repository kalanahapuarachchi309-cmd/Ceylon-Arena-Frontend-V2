import type { ButtonHTMLAttributes } from "react";

interface ButtonLoadingStateProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingLabel?: string;
}

const ButtonLoadingState = ({
  children,
  disabled,
  isLoading = false,
  loadingLabel = "Please wait...",
  ...buttonProps
}: ButtonLoadingStateProps) => (
  <button {...buttonProps} disabled={disabled || isLoading}>
    {isLoading ? loadingLabel : children}
  </button>
);

export default ButtonLoadingState;
