import { useState } from "react";
import CreateLpModal from "./CreateLpModal";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-lg shadow-pink-500/40 transition hover:bg-pink-600"
      >
        +
      </button>

      {isOpen && (
        <CreateLpModal
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingButton;