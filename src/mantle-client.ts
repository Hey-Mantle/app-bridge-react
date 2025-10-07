import { MantleClient } from "@heymantle/client";
import {
  AppBridgeReactConfig,
  MantleIdentifyParams,
  MantleIdentifyResponse,
} from "./types";

// Create a configured Mantle client instance
let mantleClient: MantleClient | null = null;

function createMantleClient(config: AppBridgeReactConfig): MantleClient | null {
  const { appId, apiKey, apiUrl } = config;

  if (!appId || !apiKey) {
    return null;
  }

  return new MantleClient({
    appId,
    apiKey,
    apiUrl: apiUrl ?? "https://appapi.heymantle.com/v1",
  });
}

// Initialize the client with configuration
export function initializeMantleClient(
  config: AppBridgeReactConfig
): MantleClient | null {
  mantleClient = createMantleClient(config);
  return mantleClient;
}

// Get the current client instance
export function getMantleClient(): MantleClient | null {
  return mantleClient;
}

// Check if client is initialized
export function isMantleClientInitialized(): boolean {
  return mantleClient !== null;
}

// Identify a customer using the Mantle client
export async function identifyCustomer(
  params: MantleIdentifyParams
): Promise<MantleIdentifyResponse> {
  if (!mantleClient) {
    return {
      customerApiToken: null,
      success: false,
      error:
        "Mantle client not initialized - call initializeMantleClient first",
    };
  }

  try {
    const response = await mantleClient.identify(params);
    if ("apiToken" in response) {
      return { customerApiToken: response.apiToken, success: true };
    } else {
      return {
        customerApiToken: null,
        success: false,
        error:
          typeof response === "string" ? response : JSON.stringify(response),
      };
    }
  } catch (error) {
    return {
      customerApiToken: null,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Reset the client (useful for testing or re-initialization)
export function resetMantleClient(): void {
  mantleClient = null;
}

export { mantleClient as default };
