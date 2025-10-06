"use client";

import React, { createContext, useContext } from "react";
import { useMantleAppBridge } from "../hooks/use-mantle-app-bridge";
import { MantleAppBridge } from "../types";

const MantleAppBridgeContext = createContext<MantleAppBridge | null>(null);

interface MantleAppBridgeProviderProps {
  children: React.ReactNode;
}

export function MantleAppBridgeProvider({
  children,
}: MantleAppBridgeProviderProps) {
  const appBridge = useMantleAppBridge();

  return (
    <MantleAppBridgeContext.Provider value={appBridge}>
      {children}
    </MantleAppBridgeContext.Provider>
  );
}

export function useSharedMantleAppBridge(): MantleAppBridge {
  const context = useContext(MantleAppBridgeContext);
  if (!context) {
    throw new Error(
      "useSharedMantleAppBridge must be used within a MantleAppBridgeProvider"
    );
  }
  return context;
}
