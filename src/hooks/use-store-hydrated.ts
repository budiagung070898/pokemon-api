import { useCallback, useSyncExternalStore } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
}

/**
 * True once a persisted Zustand store has loaded from localStorage.
 * Lets pages show a skeleton instead of flashing an empty state.
 *
 * `store.persist` only exists in the browser (there is no storage on the
 * server), so it must be read lazily inside the callbacks.
 */
export function useStoreHydrated(store: { persist: PersistApi }) {
  const subscribe = useCallback(
    (listener: () => void) => store.persist.onFinishHydration(listener),
    [store],
  );
  const getSnapshot = useCallback(() => store.persist.hasHydrated(), [store]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
