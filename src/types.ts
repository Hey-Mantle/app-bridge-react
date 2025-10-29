// TypeScript types for Mantle App Bridge API
// Based on the example at https://app.heymantle.com/app-bridge/example.html

export interface MantleAppBridge {
  // Connection status
  isConnected: boolean;

  isInIframe(): boolean;

  // Session management
  getSession(): Promise<MantleSession | null>;

  // User management
  getUser(): Promise<MantleUser | null>;

  // Organization management
  getOrganization(): Promise<MantleOrganization | null>;

  // PostMessage-based session, user, and organization requests
  requestSession(): void;
  requestUser(): void;
  requestOrganization(): void;

  // Navigation APIs
  redirect(url: string): void;
  openInNewTab(url: string): void;
  openInNewWindow(url: string, features?: string): void;

  // Shopify App Bridge compatible navigation methods
  subscribeToRedirect(
    callback: (redirectData: {
      path: string;
      method: string;
      timestamp: number;
    }) => void
  ): void;
  subscribeToNavigation(callback: (navigationData: any) => void): void;

  // Toast notifications
  showToast(message: string, type?: "success" | "error"): void;

  // Loading states
  setLoading(loading: boolean): void;

  // Environment detection
  isEmbedded(): boolean;

  // Event listeners
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;

  // Authenticated fetch
  authenticatedFetch(url: string, options: RequestInit): Promise<Response>;

  // Organization ID and session getters (from app-bridge.js)
  currentOrganizationId: string | null;
  currentSession: MantleSession | string | null;
  currentUser: MantleUser | null;
  ready: boolean;
}

export interface MantleSession {
  id: string;
  userId: string;
  organizationId: string;
  accessToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface MantleUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  avatar?: string;
  role?: string;
}

export interface MantleOrganization {
  id: string;
  name: string;
  customerTags: string[];
  contactTags: string[];
  // Add more organization properties as needed
  createdAt?: string;
  updatedAt?: string;
}

export interface MantleAppBridgeConfig {
  appId: string;
  apiUrl?: string;
  debug?: boolean;
}

// Global window interface extension
declare global {
  interface Window {
    MantleAppBridge?: MantleAppBridge | (new () => MantleAppBridge);
    mantle?: MantleAppBridge; // The actual global instance created by app-bridge.js
  }
}
