# suspense-service

[![build](https://github.com/patrickroberts/suspense-service/workflows/build/badge.svg)](https://github.com/patrickroberts/suspense-service/actions?query=workflow:build)
[![license](https://img.shields.io/github/license/patrickroberts/suspense-service.svg)](https://github.com/patrickroberts/suspense-service/blob/master/LICENSE)
[![types](https://img.shields.io/npm/types/suspense-service.svg)][npm]
[![minzipped size](https://img.shields.io/bundlephobia/minzip/suspense-service.svg)][npm]

Suspense integration library for React

## Installing

Available on [npm]

```bash
npm i suspense-service
```

## Documentation

Available on [GitHub Pages](https://patrickroberts.github.io/suspense-service/)

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
const myHandler = async endpoint => {
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
  const value = useService(MyService);

  return (
    <pre>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

const App = () => (
  // Fetch /api/v1/foo/bar
  <MyService.Provider value="/foo/bar">
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
const render = value => (
  <pre>
    {JSON.stringify(value, null, 2)}
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
    value="/foo/bar"
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
  <MyService.Provider value="/a" id="a">
    <MyService.Provider value="/b" id="b">
      <Suspense fallback={<>Loading data...</>}>
        <MyComponent />
      </Suspense>
    </MyService.Provider>
  </MyService.Provider>
);
```
</details>

[npm]: https://www.npmjs.com/package/suspense-service
