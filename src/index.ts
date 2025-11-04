// Main exports for @heymantle/app-bridge-react package

// Types
export type {
  MantleAppBridge,
  MantleModalManager,
  MantleNavMenuManager,
  MantleNewWindowOptions,
  MantleOrganization,
  MantlePageAction,
  MantlePageOptions,
  MantleSaveBarManager,
  MantleSaveBarOptions,
  MantleUser,
} from "./types";

// React hooks
export { useAppBridge } from "./hooks/use-app-bridge";
export type { UseAppBridgeReturn } from "./hooks/use-app-bridge";
export { useOrganization } from "./hooks/use-organization";
export { useUser } from "./hooks/use-user";

// App Bridge utilities
export {
  getAppBridgeConnectionStatus,
  getMantleAppBridge,
  isAppBridgeAvailable,
  isRunningInIframe,
  waitForMantleAppBridge,
} from "./app-bridge";
