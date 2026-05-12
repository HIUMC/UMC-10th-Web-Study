interface AuthRequiredModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const AuthRequiredModal = ({ onConfirm, onCancel }: AuthRequiredModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-sm rounded-lg bg-gray-900 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">로그인이 필요합니다</h2>
      <p className="mt-2 text-sm text-gray-300">
        해당 페이지에 접근하려면 로그인해주세요.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded border border-gray-600 px-4 py-1.5 text-sm text-gray-200 hover:border-gray-400"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="cursor-pointer rounded bg-pink-500 px-4 py-1.5 text-sm text-white hover:bg-pink-600"
        >
          로그인하기
        </button>
      </div>
    </div>
  </div>
);

export default AuthRequiredModal;
