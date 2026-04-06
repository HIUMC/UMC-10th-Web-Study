import { useEffect, useState, Children, isValidElement } from 'react';
// 타입 전용 임포트는 'import type'을 사용해야 에러가 나지 않습니다.
import type { ReactElement, ReactNode, FC } from 'react';

// 1. 개별 경로를 정의하는 Route 컴포넌트의 타입 정의
interface RouteProps {
  path: string;
  component: FC; // React Functional Component 타입
}

// Route 컴포넌트 구현
export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

// 2. 전체 라우팅을 관리하는 Routes 컴포넌트 구현
export const Routes = ({ children }: { children: ReactNode }) => {
  // 현재 브라우저의 경로를 상태(State)로 관리합니다.
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // 주소가 변경되었을 때 실행될 핸들러
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // 브라우저의 뒤로가기/앞으로가기(popstate) 이벤트를 감시합니다.
    window.addEventListener('popstate', handleLocationChange);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // 자식 요소(Route들)를 배열로 변환합니다.
  const routes = Children.toArray(children);

  // 현재 경로(currentPath)와 일치하는 path를 가진 Route를 찾습니다.
  const activeRoute = routes.find((child) => {
    // 1. 유효한 리액트 엘리먼트인지 확인
    // 2. 해당 엘리먼트의 props 중 path가 현재 경로와 같은지 확인
    return (
      isValidElement(child) && 
      (child.props as any).path === currentPath
    );
  }) as ReactElement | undefined;

  // 일치하는 경로가 있으면 해당 컴포넌트를 렌더링하고, 없으면 404 메시지를 보여줍니다.
  return activeRoute ? activeRoute : <h1 className="text-2xl font-bold p-4">404 - 페이지를 찾을 수 없습니다.</h1>;
};