import { useEffect } from "react";
import { useWithdraw } from "../hooks/mutations/useWithdraw";

interface WithdrawConfirmModalProps {
  onClose: () => void;
}

export default function WithdrawConfirmModal({
  onClose,
}: WithdrawConfirmModalProps) {
  const { mutate: withdraw, isPending } = useWithdraw();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleConfirm = () => {
    withdraw();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[340px] rounded-2xl bg-zinc-800 p-8 shadow-2xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <p className="mt-4 mb-8 text-[15px] font-medium text-white">
          정말 탈퇴하시겠습니까?
        </p>

        <div className="flex w-full justify-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-full bg-zinc-300 px-8 py-2 text-sm font-bold text-black transition-colors hover:bg-white disabled:opacity-50"
          >
            {isPending ? "처리중..." : "예"}
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-full bg-pink-500 px-8 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-400 disabled:opacity-50"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
