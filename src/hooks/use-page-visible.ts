import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/** False while the tab is in the background, so timers can stand down. */
export function usePageVisible() {
  return useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => true,
  );
}
