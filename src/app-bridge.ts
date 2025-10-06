import { MantleAppBridge } from "./types";

// Utility function to get the App Bridge instance
export function getMantleAppBridge(): MantleAppBridge | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.MantleAppBridge) {
    return null;
  }

  // Check if MantleAppBridge is a class constructor that needs to be instantiated
  if (
    typeof window.MantleAppBridge === "function" &&
    "prototype" in window.MantleAppBridge
  ) {
    try {
      return new (window.MantleAppBridge as new () => MantleAppBridge)();
    } catch (error) {
      // If instantiation fails, return null
      return null;
    }
  }

  return window.MantleAppBridge as MantleAppBridge;
}

// Utility function to check if the app is running in an iframe
export function isRunningInIframe(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const isInIframe = window.self !== window.top;
    return isInIframe;
  } catch (error) {
    // If we can't access window.top, we're likely in an iframe with cross-origin restrictions
    return true;
  }
}

// Utility function to wait for App Bridge to be available
export function waitForMantleAppBridge(
  timeout = 5000
): Promise<MantleAppBridge> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available"));
      return;
    }

    if (window.MantleAppBridge) {
      // Check if MantleAppBridge is a class constructor that needs to be instantiated
      if (
        typeof window.MantleAppBridge === "function" &&
        "prototype" in window.MantleAppBridge
      ) {
        try {
          const instance =
            new (window.MantleAppBridge as new () => MantleAppBridge)();
          resolve(instance);
        } catch (error) {
          // If instantiation fails, reject with error
          reject(new Error("Failed to instantiate MantleAppBridge"));
        }
      } else {
        resolve(window.MantleAppBridge as MantleAppBridge);
      }
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (window.MantleAppBridge) {
        clearInterval(checkInterval);
        // Check if MantleAppBridge is a class constructor that needs to be instantiated
        if (
          typeof window.MantleAppBridge === "function" &&
          "prototype" in window.MantleAppBridge
        ) {
          try {
            const instance =
              new (window.MantleAppBridge as new () => MantleAppBridge)();
            resolve(instance);
          } catch (error) {
            // If instantiation fails, reject with error
            reject(new Error("Failed to instantiate MantleAppBridge"));
          }
        } else {
          resolve(window.MantleAppBridge as MantleAppBridge);
        }
      } else if (elapsed > timeout) {
        clearInterval(checkInterval);
        reject(new Error("Mantle App Bridge not available after timeout"));
      }
    }, 100);
  });
}

// Utility function to check if App Bridge is available
export function isAppBridgeAvailable(): boolean {
  return getMantleAppBridge() !== null;
}

// Utility function to get connection status
export function getAppBridgeConnectionStatus(): {
  isAvailable: boolean;
  isConnected: boolean;
  isInIframe: boolean;
} {
  const appBridge = getMantleAppBridge();

  return {
    isAvailable: appBridge !== null,
    isConnected: appBridge?.isConnected ?? false,
    isInIframe: isRunningInIframe(),
  };
}
