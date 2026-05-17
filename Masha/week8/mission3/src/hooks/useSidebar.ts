import { useState } from "react";

const useSidebar = (initialValue: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialValue);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useSidebar;