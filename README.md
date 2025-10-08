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

The `AppBridgeProvider` accepts a config object with your app details.

### Hooks

#### `useAuth()`

Returns authentication state and user information.

```tsx
const { user, organization, isAuthenticated, isLoading, error, refresh } = useAuth();
```

#### `useMantleAppBridge()`

Returns the Mantle App Bridge instance for direct API access.

```tsx
const mantle = useMantleAppBridge();

// Use App Bridge methods directly
mantle.showToast('Hello!', 'success');
mantle.redirect('/some-page');
mantle.getUser();
mantle.getOrganization();
mantle.getSession();
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
import { AuthProvider, useAuth } from '@heymantle/app-bridge-react';

function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const auth = useAuth();
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

const appBridge = getMantleAppBridge();
const inIframe = isRunningInIframe();
const bridge = await waitForMantleAppBridge();
const available = isAppBridgeAvailable();
const status = getAppBridgeConnectionStatus();
```

#### Mantle Client Utilities

```tsx
import {
  initializeMantleClient,
  getMantleClient,
  identifyCustomer,
} from '@heymantle/app-bridge-react';

const client = initializeMantleClient({
  appId: 'your-app-id',
  apiKey: 'your-api-key',
});

const currentClient = getMantleClient();

const result = await identifyCustomer({
  platform: 'mantle',
  platformId: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  customFields: { plan: 'premium' },
});
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
mantle.getUser();
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
