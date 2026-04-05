import { Children, useMemo, cloneElement, isValidElement } from "react";
import type { FC, ReactElement } from "react";

import type { RoutesProps, RouteProps } from "./types";
import { useCurrentPath } from "./hooks";
import { Route } from "./Route";

const isRouteElement = (child: unknown): child is ReactElement<RouteProps> => {
  return isValidElement(child) && (child as ReactElement).type === Route;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    const matched = routes.find((route) => route.props.path === currentPath);
    return matched ?? routes.find((route) => route.props.path === "*");
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};
