// Main exports for @heymantle/app-bridge-react package

// Types
export type {
  AppBridgeReactConfig,
  AuthContextType,
  AuthOrganization,
  AuthUser,
  MantleAppBridge,
  MantleAppBridgeConfig,
  MantleIdentifyParams,
  MantleIdentifyResponse,
  MantleSession,
  MantleUser,
} from "./types";

// App Bridge utilities
export {
  getAppBridgeConnectionStatus,
  getMantleAppBridge,
  isAppBridgeAvailable,
  isRunningInIframe,
  waitForMantleAppBridge,
} from "./app-bridge";

// Mantle client utilities
export {
  getMantleClient,
  identifyCustomer,
  initializeMantleClient,
  isMantleClientInitialized,
  resetMantleClient,
} from "./mantle-client";

// React hooks
export { useAuth } from "./hooks/use-auth";
export { useMantleAppBridge } from "./hooks/use-mantle-app-bridge";

// React context providers
export { AuthProvider, useSharedAuth } from "./contexts/auth-context";
export {
  MantleAppBridgeProvider,
  useSharedMantleAppBridge,
} from "./contexts/mantle-app-bridge-context";

// Main provider component
export { AppBridgeProvider } from "./providers/app-bridge-provider";

// Default export for convenience
export { AppBridgeProvider as default } from "./providers/app-bridge-provider";
