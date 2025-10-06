"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthContextType,
  AuthOrganization,
  AuthUser,
  MantleOrganization,
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

  // Transform MantleOrganization to AuthOrganization format
  const transformOrganization = useCallback(
    (mantleOrg: MantleOrganization | null): AuthOrganization | null => {
      if (!mantleOrg) return null;

      return {
        id: mantleOrg.id,
        name: mantleOrg.name,
        customerTags: mantleOrg.customerTags || [],
        contactTags: mantleOrg.contactTags || [],
      };
    },
    []
  );

  // Fetch user and organization data
  const fetchAuthData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user and organization in parallel
      const [userData, organizationData] = await Promise.all([
        mantle.getUser(),
        mantle.getOrganization(),
      ]);

      // Transform and set user
      const transformedUser = transformUser(userData);
      setUser(transformedUser);

      // Transform and set organization
      const transformedOrg = transformOrganization(organizationData);
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
