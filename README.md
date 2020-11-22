# suspense-service

[![build](https://badgen.net/github/checks/patrickroberts/suspense-service?icon=github&label=build)](https://github.com/patrickroberts/suspense-service/actions)
[![coverage](https://badgen.net/codecov/c/github/patrickroberts/suspense-service?icon=codecov&label=coverage)](https://codecov.io/gh/patrickroberts/suspense-service)
[![license](https://badgen.net/github/license/patrickroberts/suspense-service)](https://github.com/patrickroberts/suspense-service/blob/master/LICENSE)
[![minzipped size](https://badgen.net/bundlephobia/minzip/suspense-service)][npm]
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/suspense-service)][npm]
[![types](https://badgen.net/npm/types/suspense-service?icon=typescript)][npm]
[![version](https://badgen.net/npm/v/suspense-service?color=blue&icon=npm&label=version)][npm]

[Suspense] integration library for [React]

## Why suspense-service?

This library aims to provide a generic integration between promise-based data fetching and React's Suspense API, eliminating much of the boilerplate associated with state management of asynchronous data. Without Suspense, [data fetching often looks like this](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense):

```jsx
import React, { useState, useEffect } from 'react';

const MyComponent = ({ request }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (endpoint) => {
      const response = await fetch(`/api/v1${endpoint}`);
      setData(await response.json());
      setLoading(false);
    };

    fetchData(request);
  }, [request]);

  if (loading) {
    return (
      <>Loading data...</>
    );
  }

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

const App = () => (
  <MyComponent request="/foo/bar" />
);
```

This works well for trivial cases, but the amount of effort it takes to do anything beyond the basics becomes significant. Here are a few problems this approach fails to address well.

### What if we want to provide the response to one or more deeply nested components?

We'd need to pass the response down through prop drilling, or by creating a [Context] to provide the response. Both of these solutions would take a lot of work to orchestrate, especially if we want to avoid performance penalties from unnecessarily re-rendering intermediate components.

`suspense-service` already acts as a context provider, so the response can be consumed from any component.

### What if we want to memoize expensive computations based on the response?

We'd need to create a nested component to memoize the expensive computation in its render function, and pass the response as a prop. Otherwise we'd be forced to write the `useMemo()` before `if (loading) return (...);` in order to follow the [Rules of Hooks]. This would require the factory function to first check if the `response` is ready and then conditionally perform the computation.

With `suspense-service`, we can simply write the `useMemo()` after the `useService()` hook, and perform the computation unconditionally, because the response will always be available:

```jsx
import React, { useMemo } from 'react';
import { createService, useService } from 'suspense-service';

const myHandler = async (endpoint) => {
  const response = await fetch(`/api/v1${endpoint}`);
  return response.json();
};

const MyService = createService(myHandler);

const MyComponent = () => {
  const data = useService(MyService);

  return useMemo(() => (
    // some expensive computation
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  ), [data]);
};

const App = () => (
  <MyService.Provider
    request="/foo/bar"
    fallback={<>Loading data...</>}
  >
    <MyComponent />
  </MyService.Provider>
);
```

## Installing

Package available on [npm] or [Yarn]

```bash
npm i suspense-service
yarn add suspense-service
```

## Documentation

API Reference available on [GitHub Pages]

## Code Coverage

Also available on [GitHub Pages](https://patrickroberts.github.io/suspense-service/coverage/)

## Usage

<details open>
<summary>Basic Example</summary>

```jsx
import React, { Suspense } from 'react';
import { createService, useService } from 'suspense-service';

/**
 * A user-defined service handler
 * It may accept a parameter of any type
 * but it must return a promise or thenable
 */
const myHandler = async (endpoint) => {
  const response = await fetch(`/api/v1${endpoint}`);
  return response.json();
};

/**
 * A Service is like a Context
 * It contains a Provider and a Consumer
 */
const MyService = createService(myHandler);

const MyComponent = () => {
  // Consume MyService synchronously or suspend
  // MyComponent until the response is available
  const data = useService(MyService);

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

const App = () => (
  // Fetch /api/v1/foo/bar
  <MyService.Provider request="/foo/bar">
    {/* Render fallback while MyComponent is suspended */}
    <Suspense fallback={<>Loading data...</>}>
      <MyComponent />
    </Suspense>
  </MyService.Provider>
);
```
</details>

<details open>
<summary>Render Callback</summary>

```jsx
const render = data => (
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>
);

const MyComponent = () => (
  <MyService.Consumer>{render}</MyService.Consumer>
);
```
</details>

<details open>
<summary>Inline Suspense</summary>

```jsx
const App = () => (
  // Passing the optional fallback prop
  // wraps a Suspense around the children
  <MyService.Provider
    request="/foo/bar"
    fallback={<>Loading data...</>}
  >
    <MyComponent />
  </MyService.Provider>
);
```
</details>

<details open>
<summary>Multiple Providers</summary>

```jsx
const MyComponent = () => {
  // Specify which Provider to use
  // by passing the optional id parameter
  // Omitting the id or passing null will consume
  // the closest ancestor Provider by default
  const a = useService(MyService, 'a');
  const b = useService(MyService, 'b');

  return (
    <pre>
      {JSON.stringify({ a, b }, null, 2)}
    </pre>
  );
};

const App = () => (
  // Identify each Provider with a key
  // by using the optional id prop
  <MyService.Provider request="/a" id="a">
    <MyService.Provider request="/b" id="b">
      <Suspense fallback={<>Loading data...</>}>
        <MyComponent />
      </Suspense>
    </MyService.Provider>
  </MyService.Provider>
);
```
</details>

[Suspense]: https://reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly
[React]: https://reactjs.org
[Context]: https://reactjs.org/docs/context.html
[Rules of Hooks]: https://reactjs.org/docs/hooks-rules.html
[npm]: https://www.npmjs.com/package/suspense-service
[Yarn]: https://yarnpkg.com/package/suspense-service
[GitHub Pages]: https://patrickroberts.github.io/suspense-service
