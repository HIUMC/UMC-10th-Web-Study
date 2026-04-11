import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactElement,
} from 'react';
import type { RouteProps, RoutesProps } from './types';

const getCurrentPath = () => window.location.pathname;

const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  return currentPath;
};

const isRouteElement = (
  element: unknown,
): element is ReactElement<RouteProps> => {
  return isValidElement<RouteProps>(element) && 'path' in element.props;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);

    return (
      routes.find((route) => route.props.path === currentPath) ??
      routes.find((route) => route.props.path === '*')
    );
  }, [children, currentPath]);

  if (!activeRoute) return null;

  return cloneElement(activeRoute);
};
