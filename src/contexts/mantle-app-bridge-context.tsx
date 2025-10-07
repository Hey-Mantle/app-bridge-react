"use client";

import React, { createContext, useContext } from "react";
import { MantleAppBridge } from "../types";

const MantleAppBridgeContext = createContext<MantleAppBridge | null>(null);

interface MantleAppBridgeProviderProps {
  children: React.ReactNode;
}

export function MantleAppBridgeProvider({
  children,
}: MantleAppBridgeProviderProps) {
  // Simply provide the global mantle instance directly
  // The parent project is responsible for loading the script
  const appBridge =
    typeof window !== "undefined" ? (window as any).mantle : null;

  return (
    <MantleAppBridgeContext.Provider value={appBridge}>
      {children}
    </MantleAppBridgeContext.Provider>
  );
}

export function useSharedMantleAppBridge(): MantleAppBridge | null {
  const context = useContext(MantleAppBridgeContext);
  if (context === undefined) {
    throw new Error(
      "useSharedMantleAppBridge must be used within a MantleAppBridgeProvider"
    );
  }
  return context;
}
