# suspense-service

Suspense integration library for React

## Example Usage

```jsx
import { Suspense, useMemo } from 'react';
import { createService, useService } from 'suspense-service';

const useHandler = endpoint => {
  const promise = useMemo(async () => {
    const response = await fetch(`/api/v1${endpoint}`);
    return response.json();
  }, [endpoint]);

  return promise;
};

const Service = createService(useHandler);

const MyComponent = () => {
  // consume service synchronously and suspend
  // MyComponent until the result is available
  const value = useService(Service);

  return (
    <pre>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export const App = () => {
  return (
    // fetch /api/v1/foo/bar
    <Service.Provider value="/foo/bar">
      <!-- render fallback while MyComponent is suspended -->
      <Suspense fallback={<>Loading data...</>}>
        <MyComponent />
      </Suspense>
    </Service.Provider>
  );
};
```

## Coming Soon
