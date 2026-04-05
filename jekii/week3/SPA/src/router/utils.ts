export const PUSHSTATE_EVENT = "pushstate";

export const getCurrentPath = (): string => {
  return window.location.pathname;
};

export const navigateTo = (to: string): void => {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(PUSHSTATE_EVENT));
};
