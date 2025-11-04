"use client";

import { useEffect, useState } from "react";
import { MantleAppBridge } from "../types";

export interface UseAppBridgeReturn {
  mantle: MantleAppBridge | null;
  isConnecting: boolean;
  error: string | null;
  isReady: boolean; // True only after receiving setup message from parent (fully initialized)
}

export function useAppBridge(): UseAppBridgeReturn {
  const [mantle, setMantle] = useState<MantleAppBridge | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkForMantle = () => {
      if (typeof window !== "undefined") {
        const mantleInstance = window.mantle;
        if (mantleInstance) {
          // Check if it's initialized (has received setup message)
          // The initialized property is a getter that returns true after setup message
          const initialized = mantleInstance.initialized === true;
          
          if (mounted) {
            setMantle(mantleInstance);
            setIsInitialized(initialized);
            
            if (initialized) {
              setIsConnecting(false);
              setError(null);
            }
          }
          
          return initialized; // Return true only if fully initialized
        }
      }
      return false;
    };

    // Check immediately
    if (checkForMantle()) {
      return;
    }

    // If not found or not initialized, poll for it
    const interval = setInterval(() => {
      if (checkForMantle()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (mounted) {
        setIsConnecting(false);
        
        if (!window.mantle) {
          setError(
            "Mantle App Bridge not found. Make sure the app-bridge.js script is loaded."
          );
        } else if (!window.mantle.initialized) {
          setError(
            "Mantle App Bridge initialization timeout. The parent window may not be responding."
          );
        }
      }
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []); // Empty deps - only run once on mount

  // Also listen for initialization changes if mantle instance exists
  useEffect(() => {
    if (!mantle) return;

    const checkInitialization = () => {
      if (mantle.initialized === true && !isInitialized) {
        setIsInitialized(true);
        setIsConnecting(false);
        setError(null);
      }
    };

    // Check immediately
    checkInitialization();

    // Listen for the ready event which fires when setup message is received
    const handleReady = () => {
      setIsInitialized(true);
      setIsConnecting(false);
      setError(null);
    };

    mantle.on("ready", handleReady);

    // Also poll periodically as a fallback (in case event doesn't fire)
    const interval = setInterval(checkInitialization, 100);

    return () => {
      mantle.off("ready", handleReady);
      clearInterval(interval);
    };
  }, [mantle, isInitialized]);

  return {
    mantle,
    isConnecting,
    error,
    isReady: !!mantle && isInitialized && !isConnecting,
  };
}
