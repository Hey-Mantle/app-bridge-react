# @heymantle/app-bridge-react

React hooks and utilities for Mantle App Bridge integration.

## Installation

```bash
npm install @heymantle/app-bridge-react
```

## Usage

### 1. Load the App Bridge script

```html
<script src="https://app.heymantle.com/app-bridge.js" async></script>
```

### 2. Use the hooks

```tsx
import { useAppBridge, useUser, useOrganization } from '@heymantle/app-bridge-react';

function MyComponent() {
  const { mantle, isReady, isConnecting, error } = useAppBridge();
  const { user, isLoading: userLoading } = useUser();
  const { organization, isLoading: orgLoading } = useOrganization();

  if (isConnecting || userLoading || orgLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isReady || !mantle) return <div>App Bridge not ready</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Organization: {organization?.name}</p>
      <button onClick={() => mantle.showToast('Hello!', 'success')}>
        Show Toast
      </button>
    </div>
  );
}
```

## API Reference

### Hooks

- `useAppBridge()` - Returns the App Bridge instance and connection state
- `useUser()` - Returns user information from the App Bridge
- `useOrganization()` - Returns organization information from the App Bridge  
- `useAuthenticatedFetch()` - Returns a fetch function with auth headers

### Utilities

- `getMantleAppBridge()` - Get the App Bridge instance
- `isRunningInIframe()` - Check if running in iframe
- `waitForMantleAppBridge()` - Wait for App Bridge to be available
- `isAppBridgeAvailable()` - Check if App Bridge is available
- `getAppBridgeConnectionStatus()` - Get connection status

### Types

```tsx
import type { 
  MantleAppBridge, 
  MantleOrganization, 
  MantleUser,
  MantleSession
} from '@heymantle/app-bridge-react';
```

## License

MIT
