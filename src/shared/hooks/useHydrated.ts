'use client';

import {useSyncExternalStore} from 'react';

const subscribe = () => () => {};

// Returns `false` during SSR and the first client render, then `true` after
// hydration. Use it to gate values that depend on client-only state (e.g.
// redux-persist) so server and first-client markup match (no hydration error).
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
