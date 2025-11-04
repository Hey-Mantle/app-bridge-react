"use client";

import { useCallback } from "react";
import { useAppBridge } from "./use-app-bridge";

export function useAuthenticatedFetch() {
  const { mantle, isReady } = useAppBridge();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      // isReady guarantees mantle is available and initialized
      if (!isReady || !mantle) {
        throw new Error("Mantle App Bridge not ready");
      }

      return mantle.authenticatedFetch(url, options);
    },
    [mantle, isReady]
  );

  return {
    authenticatedFetch: isReady && mantle ? authenticatedFetch : null,
    isReady,
    mantle,
  };
}
