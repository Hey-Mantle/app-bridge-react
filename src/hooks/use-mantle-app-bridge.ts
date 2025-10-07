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

  // Simply return the global mantle instance
  // The parent project is responsible for loading the script
  if ((window as any).mantle) {
    return (window as any).mantle as MantleAppBridge;
  }

  // Return a proxy that throws when accessed, but with a more helpful message
  return new Proxy({} as MantleAppBridge, {
    get(_, prop) {
      throw Error(
        `MantleAppBridge.${String(
          prop
        )} is not available. Make sure the App Bridge script is loaded by the parent project.`
      );
    },
  });
}
