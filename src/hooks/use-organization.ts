"use client";

import { useCallback, useEffect, useState } from "react";
import { MantleOrganization } from "../types";
import { useAppBridge } from "./use-app-bridge";

export function useOrganization() {
  const { mantle, isReady } = useAppBridge();
  const [organization, setOrganization] = useState<MantleOrganization | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!mantle) {
      setError("Mantle App Bridge not available");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const orgData = await mantle.getOrganization();
      setOrganization(orgData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch organization";
      setError(errorMessage);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  }, [mantle]);

  useEffect(() => {
    if (isReady && mantle) {
      fetchOrganization();
    }
  }, [isReady, mantle, fetchOrganization]);

  return {
    organization,
    isLoading,
    error,
    refetch: fetchOrganization,
  };
}
