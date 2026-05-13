import {
  Children,
  cloneElement,
  isValidElement,
  type FC,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";
import { useCurrentPath } from "./useCurrentPath";
import type { RouteProps, RoutesProps } from "./types";

const isRouteElement = (
  child: ReactNode,
): child is ReactElement<RouteProps> => {
  return isValidElement<RouteProps>(child);
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return <h1>404</h1>;

  return cloneElement(activeRoute);
};
