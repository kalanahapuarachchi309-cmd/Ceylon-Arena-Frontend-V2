import type { ReactNode } from "react";

import CustomModal from "./CustomModal";

interface CustomPopupProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

const CustomPopup = ({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidth,
}: CustomPopupProps) => (
  <CustomModal
    isOpen={isOpen}
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    maxWidth={maxWidth}
  >
    {children}
  </CustomModal>
);

export default CustomPopup;
