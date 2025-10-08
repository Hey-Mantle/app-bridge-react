"use client";

import { useCallback, useEffect, useState } from "react";
import { MantleUser } from "../types";
import { useAppBridge } from "./use-app-bridge";

export function useUser() {
  const { mantle, isReady } = useAppBridge();
  const [user, setUser] = useState<MantleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!mantle) {
      setError("Mantle App Bridge not available");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userData = await mantle.getUser();
      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user";
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [mantle]);

  useEffect(() => {
    if (isReady && mantle) {
      fetchUser();
    }
  }, [isReady, mantle, fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
