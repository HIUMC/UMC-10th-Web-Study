import type { MouseEvent } from 'react';
import type { LinkProps } from './types';
import { getCurrentPath, navigateTo } from './utils';

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }

    e.preventDefault();
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
