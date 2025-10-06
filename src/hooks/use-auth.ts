"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthContextType,
  AuthOrganization,
  AuthUser,
  MantleSession,
  MantleUser,
} from "../types";
import { useMantleAppBridge } from "./use-mantle-app-bridge";

export function useAuth(): AuthContextType {
  const mantle = useMantleAppBridge();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<AuthOrganization | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform App Bridge user to AuthUser format
  const transformUser = useCallback(
    (appBridgeUser: MantleUser | null): AuthUser | null => {
      if (!appBridgeUser) return null;

      return {
        id: appBridgeUser.id,
        email: appBridgeUser.email,
        name: appBridgeUser.name,
        avatar: appBridgeUser.avatar,
        role: appBridgeUser.role,
      };
    },
    []
  );

  // Transform session to organization
  const transformOrganization = useCallback(
    (session: MantleSession | string | null): AuthOrganization | null => {
      if (!session) return null;

      // If session is a string, we don't have organization info
      if (typeof session === "string") return null;

      return {
        id: session.organizationId,
        name: `Organization ${session.organizationId}`, // Default name if not available
      };
    },
    []
  );

  // Fetch user and session data
  const fetchAuthData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user and session in parallel
      const [userData, sessionData] = await Promise.all([
        mantle.getUser(),
        mantle.getSession(),
      ]);

      // Transform and set user
      const transformedUser = transformUser(userData);
      setUser(transformedUser);

      // Transform and set organization
      const transformedOrg = transformOrganization(sessionData);
      setOrganization(transformedOrg);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch auth data";
      setError(errorMessage);
      setUser(null);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  }, [mantle, transformUser, transformOrganization]);

  // Auto-fetch auth data on mount
  useEffect(() => {
    fetchAuthData();
  }, [fetchAuthData]);

  const isAuthenticated = !!user && !!organization;

  return {
    user,
    organization,
    isAuthenticated,
    isLoading,
    error,
    // Expose refresh function for manual updates
    refresh: fetchAuthData,
  };
}
