import {
  useEffect,
  useState,
  type ReactNode,
  Children,
  cloneElement,
  type ElementType,
} from "react";

// Route 타입
type RouteProps = {
  path: string;
  component: ElementType;
};

// Route 컴포넌트
export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

// 현재 경로
const useCurrentPath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return path;
};

// Link
export const Link = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return <a href={to} onClick={handleClick}>{children}</a>;
};

// Routes
export const Routes = ({ children }: { children: ReactNode }) => {
  const currentPath = useCurrentPath();

  const routes = Children.toArray(children) as React.ReactElement<RouteProps>[];

  const activeRoute = routes.find(
    (route) => route.props.path === currentPath
  );

  if (!activeRoute) return <h1>404</h1>;

  return cloneElement(activeRoute);
};