"use client";

import { useEffect, useState } from "react";
import { MantleAppBridge } from "../types";

export interface UseAppBridgeReturn {
  mantle: MantleAppBridge | null;
  isConnecting: boolean;
  error: string | null;
  isReady: boolean;
}

export function useAppBridge(): UseAppBridgeReturn {
  const [mantle, setMantle] = useState<MantleAppBridge | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkForMantle = () => {
      if (typeof window !== "undefined") {
        const mantleInstance = window.mantle;
        if (mantleInstance) {
          setMantle(mantleInstance);
          setIsConnecting(false);
          setError(null);
          return true;
        }
      }
      return false;
    };

    // Check immediately
    if (checkForMantle()) {
      return;
    }

    // If not found, poll for it
    const interval = setInterval(() => {
      if (checkForMantle()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsConnecting(false);
      setError(
        "Mantle App Bridge not found. Make sure the app-bridge.js script is loaded."
      );
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return {
    mantle,
    isConnecting,
    error,
    isReady: !!mantle && !isConnecting,
  };
}
