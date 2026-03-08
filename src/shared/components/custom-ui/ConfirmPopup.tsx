import CustomModal from "./CustomModal";

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

const ConfirmPopup = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmPopupProps) => (
  <CustomModal
    isOpen={isOpen}
    title={title}
    subtitle={message}
    onClose={onCancel}
    maxWidth={560}
    actions={
      <>
        <button className="btn btn-cancel" type="button" onClick={onCancel} disabled={isConfirming}>
          {cancelLabel}
        </button>
        <button className="btn btn-submit" type="button" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming ? "Processing..." : confirmLabel}
        </button>
      </>
    }
  >
    <div className="custom-modal-confirm-body">
      <p>{message}</p>
    </div>
  </CustomModal>
);

export default ConfirmPopup;
