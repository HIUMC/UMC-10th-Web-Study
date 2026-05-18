import { useState } from "react";
import LpFormModal from "../lp/LpFormModal";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="새 LP 작성"
        className="fixed right-6 bottom-6 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg transition-colors hover:bg-pink-600"
      >
        +
      </button>
      {isOpen && (
        <LpFormModal mode="create" onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default FloatingButton;
