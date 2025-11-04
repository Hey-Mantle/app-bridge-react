// TypeScript types for Mantle App Bridge API
// Based on the actual implementation in app-bridge.js

export interface MantleModalManager {
  show: (id: string) => void;
  hide: (id: string) => void;
  toggle: (id: string) => void;
}

export interface MantleSaveBarManager {
  show: (id: string) => void;
  hide: (id: string) => void;
}

export interface MantleNavMenuManager {
  show: (id: string) => void;
  hide: (id: string) => void;
}

export interface MantlePageOptions {
  title?: string;
  [key: string]: any;
}

export interface MantlePageAction {
  content?: string;
  onAction?: () => void;
  [key: string]: any;
}

export interface MantleSaveBarOptions {
  message?: string;
  [key: string]: any;
}

export interface MantleNewWindowOptions {
  width?: number;
  height?: number;
  [key: string]: any;
}

/**
 * Complete TypeScript interface for the Mantle App Bridge instance
 * This matches the actual implementation in app-bridge.js
 */
export interface MantleAppBridge {
  // ============================================
  // Read-only Properties (getters)
  // ============================================
  readonly isReady: boolean; // True when instance exists and can receive messages
  readonly initialized: boolean; // True only after receiving setup message from parent
  readonly ready: boolean; // Alias for isReady
  readonly currentSession: string | null; // Session token (JWT string)
  readonly currentUser: MantleUser | null;
  readonly currentOrganizationId: string | null;
  readonly currentOrganization: MantleOrganization | null;

  // ============================================
  // Utility Managers
  // ============================================
  readonly modal: MantleModalManager;
  readonly saveBar: MantleSaveBarManager;
  readonly navMenu: MantleNavMenuManager;
  readonly modalManager: any; // Internal use, typically not accessed directly

  // ============================================
  // Page Management
  // ============================================
  setPage(options?: MantlePageOptions): void;
  setPagePrimaryAction(action: MantlePageAction): void;

  // ============================================
  // Navigation
  // ============================================
  redirect(url: string): void;
  setPath(path: string): void;
  openInNewTab(url: string): void;
  openInNewWindow(url: string, options?: MantleNewWindowOptions): void;
  subscribeToRedirect(
    callback: (data: { path: string; method: string; fullUrl?: string }) => void
  ): void;

  // ============================================
  // Content Size Management
  // ============================================
  setContentSize(options: {
    height?: number;
    width?: number;
    componentId?: string;
  }): Promise<void>;
  observeContentSize(
    elementOrSelector: HTMLElement | string,
    options?: {
      componentId?: string;
      enabled?: boolean;
      debounceMs?: number;
    }
  ): () => void;

  // ============================================
  // UI State Management
  // ============================================
  setFullPage(fullPage: boolean): void;

  // ============================================
  // Toast Notifications
  // ============================================
  showToast(message: string, status?: "success" | "error"): void;
  showSuccess(message: string): void;
  showError(message: string): void;

  // ============================================
  // Save Bar
  // ============================================
  showSaveBar(): void;
  hideSaveBar(): void;
  setSaveBarOptions(options: MantleSaveBarOptions): void;

  // ============================================
  // Asset Library
  // ============================================
  showAssetLibrary(): void;
  hideAssetLibrary(): void;

  // ============================================
  // Modal Overlay
  // ============================================
  showModalBackgroundOverlay(): void;
  hideModalBackgroundOverlay(): void;
  closeModal(): void;

  // ============================================
  // Session Management
  // ============================================
  /**
   * Request session data from the parent window with intelligent caching
   * @returns Promise that resolves to the session token (JWT string)
   */
  requestSession(): Promise<string>;
  /**
   * Get session token - simple async method that returns just the token string
   * @returns Promise that resolves to the session token (JWT string)
   */
  getSessionToken(): Promise<string>;

  // ============================================
  // User Management
  // ============================================
  /**
   * Request user data from the parent window
   * This sends a postMessage request but doesn't return a promise directly.
   * Use getUser() for promise-based access.
   */
  requestUser(): void;
  /**
   * Get user data with intelligent caching
   * @returns Promise that resolves to the user object
   */
  getUser(): Promise<MantleUser>;

  // ============================================
  // Organization Management
  // ============================================
  /**
   * Request organization data from the parent window
   * This sends a postMessage request but doesn't return a promise directly.
   * Use getOrganization() for promise-based access.
   */
  requestOrganization(): void;
  /**
   * Get organization data with intelligent caching
   * @returns Promise that resolves to the organization object
   */
  getOrganization(): Promise<MantleOrganization>;

  // ============================================
  // Authenticated Fetch
  // ============================================
  /**
   * Authenticated fetch helper that automatically includes Bearer token authorization
   * @param url - The URL to fetch
   * @param options - Standard fetch options (method, body, headers, etc.)
   * @returns Promise that resolves to a Response object
   */
  authenticatedFetch(url: string, options?: RequestInit): Promise<Response>;

  // ============================================
  // Event System
  // ============================================
  on(event: string, handler: (data?: any) => void): void;
  off(event: string, handler: (data?: any) => void): void;
  trigger(event: string, data?: any): void;

  // ============================================
  // Utility Methods
  // ============================================
  /**
   * Wait for app bridge to be ready
   * @returns Promise that resolves when ready
   */
  waitForReady(): Promise<void>;
  log(...args: any[]): void;

  // ============================================
  // Internal/Advanced Methods
  // ============================================
  /**
   * Send a message to the parent window
   * @internal Typically not called directly by consumers
   */
  sendMessage(type: string, data?: any): void;
  /**
   * Create an action callback
   * @internal Typically not called directly by consumers
   */
  createAction(callback: () => void): string;
  /**
   * Clear session cache
   * @internal Typically not called directly by consumers
   */
  clearSessionCache(): void;
}

/**
 * User object returned from getUser() and requestUser()
 * Matches the response from app-bridge-server handleUserRequest()
 */
export interface MantleUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  allowedFeatures: string[];
  isSuperUser?: boolean;
}

/**
 * Organization object returned from getOrganization() and requestOrganization()
 * Matches the response from app-bridge-server handleOrganizationRequest()
 */
export interface MantleOrganization {
  id: string;
  name: string;
  customerTags: string[];
  contactTags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Global window interface extension
declare global {
  interface Window {
    MantleAppBridge?: MantleAppBridge | (new () => MantleAppBridge);
    mantle?: MantleAppBridge; // The actual global instance created by app-bridge.js
  }
}
