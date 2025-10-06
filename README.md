# @heymantle/app-bridge-react

A React package that abstracts Mantle App Bridge, client initialization, and auth context management for reusable elements.

## Features

- 🔗 **App Bridge Integration**: Complete App Bridge initialization and management
- 🔐 **Authentication**: Built-in auth context with user and organization management
- 🎯 **Mantle Client**: Automatic client initialization and customer identification
- ⚛️ **React Hooks**: Easy-to-use hooks for App Bridge and auth state
- 🎨 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🚀 **Zero Config**: Works out of the box with sensible defaults

## Installation

```bash
npm install @heymantle/app-bridge-react
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { AppBridgeProvider } from '@heymantle/app-bridge-react';

function App() {
  return (
    <AppBridgeProvider
      config={{
        appId: process.env.NEXT_PUBLIC_MANTLE_APP_ID!,
        apiKey: process.env.MANTLE_APP_API_KEY,
        apiUrl: process.env.NEXT_PUBLIC_MANTLE_APP_API_URL,
        debug: process.env.NODE_ENV === 'development',
      }}
    >
      <YourApp />
    </AppBridgeProvider>
  );
}
```

### 2. Use the hooks in your components

```tsx
import { useAuth, useMantleAppBridge } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { user, organization, isAuthenticated, isLoading } = useAuth();
  const mantle = useMantleAppBridge();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  function handleShowToast() {
    mantle.showToast('Hello from Mantle!', 'success');
  }

  function handleRedirect() {
    mantle.redirect('/some-page');
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Organization: {organization?.name}</p>
      <button onClick={handleShowToast}>Show Toast</button>
      <button onClick={handleRedirect}>Redirect</button>
    </div>
  );
}
```

## API Reference

### Configuration

```tsx
interface AppBridgeReactConfig {
  appId: string;           // Required: Your Mantle app ID
  apiKey?: string;         // Optional: Your Mantle API key
  apiUrl?: string;         // Optional: Custom API URL (defaults to Mantle's)
  debug?: boolean;         // Optional: Enable debug logging
}
```

### Hooks

#### `useAuth()`

Returns authentication state and user information.

```tsx
const {
  user,              // AuthUser | null
  organization,      // AuthOrganization | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  error,             // string | null
  refresh,           // () => Promise<void>
} = useAuth();
```

#### `useMantleAppBridge()`

Returns the Mantle App Bridge instance for direct API access.

```tsx
const mantle = useMantleAppBridge();

// Use App Bridge methods directly
mantle.showToast('Hello!', 'success');
mantle.redirect('/some-page');
mantle.getUser().then(user => console.log(user));
mantle.getSession().then(session => console.log(session));
mantle.authenticatedFetch('/api/data', { method: 'GET' });
```

### Context Providers

#### `MantleAppBridgeProvider`

Provides App Bridge functionality to child components.

```tsx
import { MantleAppBridgeProvider, useSharedMantleAppBridge } from '@heymantle/app-bridge-react';

function App() {
  return (
    <MantleAppBridgeProvider>
      <MyComponent />
    </MantleAppBridgeProvider>
  );
}

function MyComponent() {
  const appBridge = useSharedMantleAppBridge();
  // Use appBridge...
}
```

#### `AuthProvider`

Provides authentication state to child components.

```tsx
import { AuthProvider, useSharedAuth } from '@heymantle/app-bridge-react';

function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const auth = useSharedAuth();
  // Use auth...
}
```

### Utilities

#### App Bridge Utilities

```tsx
import {
  getMantleAppBridge,
  isRunningInIframe,
  waitForMantleAppBridge,
  isAppBridgeAvailable,
  getAppBridgeConnectionStatus,
} from '@heymantle/app-bridge-react';

// Get the current App Bridge instance
const appBridge = getMantleAppBridge();

// Check if running in iframe
const inIframe = isRunningInIframe();

// Wait for App Bridge to be available
const bridge = await waitForMantleAppBridge();

// Check if App Bridge is available
const available = isAppBridgeAvailable();

// Get connection status
const status = getAppBridgeConnectionStatus();
```

#### Mantle Client Utilities

```tsx
import {
  initializeMantleClient,
  getMantleClient,
  identifyCustomer,
} from '@heymantle/app-bridge-react';

// Initialize the client
const client = initializeMantleClient({
  appId: 'your-app-id',
  apiKey: 'your-api-key',
});

// Get the current client
const currentClient = getMantleClient();

// Identify a customer
const result = await identifyCustomer({
  platform: 'mantle',
  platformId: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  customFields: { plan: 'premium' },
});
```

## Type Definitions

### Core Types

```tsx
interface MantleUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  avatar?: string;
  role?: string;
}

interface MantleSession {
  id: string;
  userId: string;
  organizationId: string;
  accessToken: string;
  expiresAt: string;
  createdAt: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface AuthOrganization {
  id: string;
  name: string;
  slug?: string;
}
```

## Environment Variables

Set these environment variables in your application:

```bash
# Required
NEXT_PUBLIC_MANTLE_APP_ID=your_app_id

# Optional
MANTLE_APP_API_KEY=your_api_key
NEXT_PUBLIC_MANTLE_APP_API_URL=https://appapi.heymantle.com/v1
```

## Migration from Existing Code

If you're migrating from existing App Bridge code, you can replace:

```tsx
// Before - Complex state management
const { 
  appBridge, 
  isConnected, 
  session, 
  user, 
  isLoading 
} = useMantleAppBridge();

// After - Simple direct access
const mantle = useMantleAppBridge();
const { user, organization, isAuthenticated, isLoading } = useAuth();

// Use App Bridge methods directly
mantle.showToast('Hello!', 'success');
mantle.getUser().then(user => console.log(user));
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd app-bridge-react

# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes during development
npm run dev
```

### Scripts

- `npm run build` - Build the TypeScript package
- `npm run dev` - Watch mode for development
- `npm run prepublishOnly` - Build before publishing

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

### Publishing

This package is published to npm under the `@heymantle` scope. To publish:

```bash
npm run build
npm publish
```

## License

MIT
