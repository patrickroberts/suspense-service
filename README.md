# suspense-service

![build](https://github.com/patrickroberts/suspense-service/workflows/build/badge.svg)

Suspense integration library for React

## Examples

### Overview

```jsx
import React, { Suspense, useMemo } from 'react';
import { createService, useService } from 'suspense-service';

// User-defined service handler hook
// It may accept a parameter of any type
// but it must return a promise or thenable
const useHandler = endpoint => {
  const promise = useMemo(async () => {
    const response = await fetch(`/api/v1${endpoint}`);
    return response.json();
  }, [endpoint]);

  return promise;
};

// A Service is much like a Context
// It contains a Provider and a Consumer
const Service = createService(useHandler);

const MyComponent = () => {
  // Consume service synchronously and suspend
  // MyComponent until the result is available
  const value = useService(Service);

  return (
    <pre>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export const App = () => (
  // Fetch /api/v1/foo/bar
  <Service.Provider value="/foo/bar">
    {/* Render fallback while MyComponent is suspended */}
    <Suspense fallback={<>Loading data...</>}>
      <MyComponent />
    </Suspense>
  </Service.Provider>
);
```

### Inline Suspense

```jsx
export const App = () => (
  // Providing the optional fallback prop
  // will wrap the children with a Suspense
  <Service.Provider value="/foo/bar" fallback={<>Loading data...</>}>
    <MyComponent />
  </Service.Provider>
);
```

### Multiple Providers

```jsx
const MyComponent = () => {
  // Specify which Provider to use with the optional id
  // Omitting the id or passing null will consume the
  // closest ancestor Provider by default
  const a = useService(Service, 'a');
  const b = useService(Service, 'b');

  return (
    <pre>
      {JSON.stringify({ a, b }, null, 2)}
    </pre>
  );
};

export const App = () => (
  // Give each Provider a key using the optional id
  <Service.Provider value="/a" id="a">
    <Service.Provider value="/b" id="b">
      <Suspense fallback={<>Loading data...</>}>
        <MyComponent />
      </Suspense>
    </Service.Provider>
  </Service.Provider>
);
```

## Coming Soon
