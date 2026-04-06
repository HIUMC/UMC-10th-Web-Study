import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type ReactElement,
} from 'react';
import { useCurrentPath } from './hooks';
import type { RouteProps, RoutesProps } from './types';

const isRouteElement = (
  element: unknown
): element is ReactElement<RouteProps> => {
  return isValidElement<RouteProps>(element);
};

export const Routes = ({ children }: RoutesProps) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return <h1>404 - 페이지를 찾을 수 없습니다.</h1>;

  return cloneElement(activeRoute);
};