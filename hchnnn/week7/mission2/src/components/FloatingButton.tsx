import { useState } from 'react';
import CreateLpModal from './CreateLpModal';

const FloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="floating-button"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      {isModalOpen && (
        <CreateLpModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default FloatingButton;