import { useWithdraw } from "../hooks/useAuth";

interface WithdrawModalProps {
  onClose: () => void;
}

const WithdrawModal = ({ onClose }: WithdrawModalProps) => {
  const withdrawMutation = useWithdraw();

  const handleWithdraw = () => {
    withdrawMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        sessionStorage.clear();

        alert("탈퇴가 완료되었습니다.");

        window.location.href = "/login";
      },

      onError: (error: unknown) => {
        console.error("탈퇴 실패:", error);
        alert("탈퇴에 실패했습니다.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1f1f2e] p-10 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-white/60 hover:text-white"
        >
          ×
        </button>

        <h2 className="mb-10 text-center text-2xl font-bold">
          정말 탈퇴하시겠습니까?
        </h2>

        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="rounded-lg bg-gray-200 px-8 py-3 font-bold text-black hover:bg-gray-300 disabled:opacity-50"
          >
            {withdrawMutation.isPending ? "처리 중..." : "예"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-pink-500 px-8 py-3 font-bold text-white hover:bg-pink-600"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;