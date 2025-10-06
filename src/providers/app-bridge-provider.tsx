"use client";

import { MantleProvider } from "@heymantle/react";
import React, { useEffect } from "react";
import { AuthProvider } from "../contexts/auth-context";
import { MantleAppBridgeProvider } from "../contexts/mantle-app-bridge-context";
import { initializeMantleClient } from "../mantle-client";
import { AppBridgeReactConfig } from "../types";

interface AppBridgeProviderProps {
  children: React.ReactNode;
  config: AppBridgeReactConfig;
}

export function AppBridgeProvider({
  children,
  config,
}: AppBridgeProviderProps) {
  const { appId, apiKey, apiUrl } = config;

  // Initialize Mantle client on mount
  useEffect(() => {
    if (appId && apiKey) {
      initializeMantleClient(config);
    }
  }, [appId, apiKey, apiUrl, config]);

  // If no appId is provided, render children without MantleProvider
  // This prevents the "MantleClient appId is required" error
  if (!appId) {
    return (
      <MantleAppBridgeProvider>
        <AuthProvider>{children}</AuthProvider>
      </MantleAppBridgeProvider>
    );
  }

  return (
    <MantleProvider
      appId={appId}
      apiUrl={apiUrl ?? "https://appapi.heymantle.com/v1"}
      customerApiToken="" // Will be set after OAuth completion
    >
      <MantleAppBridgeProvider>
        <AuthProvider>{children}</AuthProvider>
      </MantleAppBridgeProvider>
    </MantleProvider>
  );
}
