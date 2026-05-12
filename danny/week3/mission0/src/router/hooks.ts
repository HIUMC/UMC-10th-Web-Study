import { useState, useEffect } from "react";
import { getCurrentPath } from "./utils";

export const useCurrentPath = (): string => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return path;
};
