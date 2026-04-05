import { useEffect, useState } from "react";
import { getCurrentPath, PUSHSTATE_EVENT } from "./utils";

export const useCurrentPath = (): string => {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handleRouteChange = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener(PUSHSTATE_EVENT, handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener(PUSHSTATE_EVENT, handleRouteChange);
    };
  }, []);

  return path;
};
