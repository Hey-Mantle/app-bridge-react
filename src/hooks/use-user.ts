"use client";

import { useCallback, useEffect, useState } from "react";
import { useSharedMantleAppBridge } from "../contexts/mantle-app-bridge-context";
import { MantleUser } from "../types";

/**
 * Hook to get the current user from the App Bridge.
 *
 * @returns Object containing user data, loading state, and error state
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, isLoading, error } = useUser();
 *
 *   if (isLoading) return <div>Loading user...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!user) return <div>No user found</div>;
 *
 *   return <div>Welcome, {user.name}!</div>;
 * }
 * ```
 */
export function useUser() {
  const appBridge = useSharedMantleAppBridge();
  const [user, setUser] = useState<MantleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!appBridge) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userData = await appBridge.getUser();
      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user";
      setError(errorMessage);
      console.error("useUser: Failed to fetch user", err);
    } finally {
      setIsLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
