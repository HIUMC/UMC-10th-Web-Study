interface ConfirmModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmModal = ({
  message,
  confirmText = '예',
  cancelText = '아니오',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="confirm-modal-close-button"
          onClick={onCancel}
        >
          ×
        </button>

        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-button-yes"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </button>

          <button
            type="button"
            className="confirm-button-no"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;