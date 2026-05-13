import { useEffect, useState } from 'react';
import { POPSTATE_EVENT, PUSHSTATE_EVENT } from './constants';
import { getCurrentPath } from './utils';

export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener(PUSHSTATE_EVENT, handlePathChange);
    window.addEventListener(POPSTATE_EVENT, handlePathChange);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handlePathChange);
      window.removeEventListener(POPSTATE_EVENT, handlePathChange);
    };
  }, []);

  return path;
};