"use client";

import { useCallback, useEffect, useState } from "react";
import { useSharedMantleAppBridge } from "../contexts/mantle-app-bridge-context";
import { MantleOrganization } from "../types";

/**
 * Hook to get the current organization from the App Bridge.
 *
 * @returns Object containing organization data, loading state, and error state
 *
 * @example
 * ```tsx
 * function OrganizationInfo() {
 *   const { organization, isLoading, error } = useOrganization();
 *
 *   if (isLoading) return <div>Loading organization...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!organization) return <div>No organization found</div>;
 *
 *   return <div>Organization: {organization.name}</div>;
 * }
 * ```
 */
export function useOrganization() {
  const appBridge = useSharedMantleAppBridge();
  const [organization, setOrganization] = useState<MantleOrganization | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!appBridge) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const orgData = await appBridge.getOrganization();
      setOrganization(orgData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch organization";
      setError(errorMessage);
      console.error("useOrganization: Failed to fetch organization", err);
    } finally {
      setIsLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    isLoading,
    error,
    refetch: fetchOrganization,
  };
}
