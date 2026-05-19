type FloatingActionButtonProps = {
  onClick: () => void;
};

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button type="button" className="floating-button" aria-label="LP 작성" onClick={onClick}>
      +
    </button>
  );
}
