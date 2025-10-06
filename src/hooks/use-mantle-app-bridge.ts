"use client";

import { MantleAppBridge } from "../types";

/**
 * This proxy is used to throw a helpful error message when trying to access
 * the `MantleAppBridge` global in a server environment.
 */
const serverProxy = new Proxy({} as MantleAppBridge, {
  get(_, prop) {
    throw Error(
      `MantleAppBridge.${String(
        prop
      )} can't be used in a server environment. You likely need to move this code into an Effect.`
    );
  },
});

/**
 * This hook returns the `MantleAppBridge` global variable to use
 * App Bridge APIs such as `showToast`, `redirect`, and `getUser`.
 *
 * @example
 * ```jsx
 * import { useMantleAppBridge } from '@heymantle/app-bridge-react';
 *
 * function MyComponent() {
 *   const mantle = useMantleAppBridge();
 *
 *   function handleShowToast() {
 *     mantle.showToast('Hello from Mantle!', 'success');
 *   }
 *
 *   function handleGetUser() {
 *     mantle.getUser().then(user => {
 *       console.log('User:', user);
 *     });
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleShowToast}>Show Toast</button>
 *       <button onClick={handleGetUser}>Get User</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns `MantleAppBridge` instance or a Proxy that throws when incorrectly accessed when not in a browser context
 */
export function useMantleAppBridge(): MantleAppBridge {
  if (typeof window === "undefined") {
    return serverProxy;
  }

  if (!window.MantleAppBridge) {
    throw Error(
      "The MantleAppBridge global is not defined. This likely means the App Bridge script tag was not added correctly to this page"
    );
  }

  // Handle both instance and constructor cases
  if (
    typeof window.MantleAppBridge === "function" &&
    "prototype" in window.MantleAppBridge
  ) {
    return new (window.MantleAppBridge as new () => MantleAppBridge)();
  }

  return window.MantleAppBridge as MantleAppBridge;
}
