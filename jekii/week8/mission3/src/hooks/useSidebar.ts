import { useCallback, useEffect, useState } from "react";

const getInitialOpenState = () =>
  typeof window !== "undefined" ? window.innerWidth >= 768 : false;

function useSidebar() {
  const [isOpen, setIsOpen] = useState(getInitialOpenState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export default useSidebar;
