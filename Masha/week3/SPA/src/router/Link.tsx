import type { ReactNode, MouseEvent } from 'react';

interface LinkProps {
  to: string;
  children: ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 1. 서버로의 전체 리로드를 막음
    e.preventDefault();

    // 2. 주소창의 URL만 바꿈 (서버 요청 X)
    window.history.pushState({}, '', to);

    // 3. 주소가 바뀌었다는 이벤트를 앱 전체에 알림
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return (
    <a href={to} onClick={handleClick} style={{ textDecoration: 'none', color: 'blue', marginRight: '10px' }}>
      {children}
    </a>
  );
};