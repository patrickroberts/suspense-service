suspense-service / [Exports](modules.md)

# suspense-service

[![build](https://badgen.net/github/checks/patrickroberts/suspense-service?icon=github&label=build)](https://github.com/patrickroberts/suspense-service/actions)
[![coverage](https://badgen.net/codecov/c/github/patrickroberts/suspense-service?icon=codecov&label=coverage)](https://codecov.io/gh/patrickroberts/suspense-service)
[![license](https://badgen.net/github/license/patrickroberts/suspense-service)](https://github.com/patrickroberts/suspense-service/blob/master/LICENSE)
[![minzipped size](https://badgen.net/bundlephobia/minzip/suspense-service)][npm]
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/suspense-service)][npm]
[![types](https://badgen.net/npm/types/suspense-service?icon=typescript)][npm]
[![version](https://badgen.net/npm/v/suspense-service?color=blue&icon=npm&label=version)][npm]

[Suspense] integration library for [React]

```jsx
import { Suspense } from 'react';
import { createService, useService } from 'suspense-service';

const myHandler = async (request) => {
  const response = await fetch(request);
  return response.json();
};

const MyService = createService(myHandler);

const MyComponent = () => {
  const data = useService(MyService);

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

const App = () => (
  <MyService.Provider request="https://swapi.dev/api/planets/2/">
    <Suspense fallback="Loading data...">
      <MyComponent />
    </Suspense>
  </MyService.Provider>
);
```

[![Edit suspense-service-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-demo-sm9m5)

## Why suspense-service?

This library aims to provide a generic integration between promise-based data fetching and React's Suspense API, eliminating much of the boilerplate associated with state management of asynchronous data. _Without Suspense, [data fetching often looks like this](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense)_:

```jsx
import { useState, useEffect } from 'react';

const MyComponent = ({ request }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (request) => {
      const response = await fetch(request);
      setData(await response.json());
      setLoading(false);
    };

    fetchData(request);
  }, [request]);

  if (loading) {
    return 'Loading data...';
  }

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

const App = () => (
  <MyComponent request="https://swapi.dev/api/planets/2/" />
);
```

This may work well for trivial cases, but the amount of effort and code required tends to increase significantly for anything more advanced. Here are a few difficulities with this approach that `suspense-service` is intended to simplify.

<details>
<summary>Avoiding race conditions caused by out-of-order responses</summary>

Accomplishing this with the approach above would require additional logic to index each of the requests and compose a promise chain to ensure responses from older requests don't overwrite the current state when one from a more recent request is already available.

[Concurrent Mode was designed to inherently solve this type of race condition using Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html#suspense-and-race-conditions).
</details>

<details>
<summary>Providing the response to one or more deeply nested components</summary>

This would typically be done by passing the response down through props, or by creating a [Context] to provide the response. Both of these solutions would require a lot of effort, especially if you want to avoid re-rendering the intermediate components that aren't even using the response.

`suspense-service` already creates an optimized context provider that allows the response to be consumed from multiple nested components without making multiple requests.
</details>

<details>
<summary>Memoizing expensive computations based on the response</summary>

Expanding on the approach above, care would be needed in order to write a `useMemo()` that follows the [Rules of Hooks], and the expensive computation would need to be made conditional on the availability of `data` since it wouldn't be populated until a later re-render.

With `suspense-service`, you can simply pass `data` from `useService()` to `useMemo()`, and perform the computation unconditionally, because the component is suspended until the response is made available synchronously:

```jsx
const MyComponent = () => {
  const data = useService(MyService);
  // some expensive computation
  const formatted = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <pre>
      {formatted}
    </pre>
  );
};
```

[![Edit suspense-service-expensive-computation](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-expensive-computation-qmwi9)

</details>

<details>
<summary>Other solved problems</summary>

[Concurrent Mode] introduces some UI patterns that were difficult to achieve with the existing approach. These patterns include [Transitions] and [Deferring a value].
</details>

## Installing

Package available on [npm] or [Yarn]

```bash
npm i suspense-service
yarn add suspense-service
```

## Usage

### `Service`

<details>
<summary>Basic Example</summary>

```jsx
import { Suspense } from 'react';
import { createService, useService } from 'suspense-service';

/**
 * A user-defined service handler
 * It may accept a parameter of any type
 * but it must return a promise or thenable
 */
const myHandler = async (request) => {
  const response = await fetch(request);
  return response.json();
};

/**
 * A Service is like a Context
 * It contains a Provider and a Consumer
 */
const MyService = createService(myHandler);

const MyComponent = () => {
  // Consumes MyService synchronously by suspending
  // MyComponent until the response is available
  const data = useService(MyService);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

const App = () => (
  // Fetch https://swapi.dev/api/people/1/
  <MyService.Provider request="https://swapi.dev/api/people/1/">
    {/* Render fallback while MyComponent is suspended */}
    <Suspense fallback="Loading data...">
      <MyComponent />
    </Suspense>
  </MyService.Provider>
);
```

[![Edit suspense-service-basic-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-basic-example-oidy0)

</details>

<details>
<summary>Render Callback</summary>

```jsx
const MyComponent = () => (
  // Subscribe to MyService using a callback function
  <MyService.Consumer>
    {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
  </MyService.Consumer>
);
```

[![Edit suspense-service-render-callback](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-render-callback-sf2tw)

</details>

<details>
<summary>Inline Suspense</summary>

```jsx
const App = () => (
  // Passing the optional fallback prop
  // wraps a Suspense around the children
  <MyService.Provider
    request="https://swapi.dev/api/people/1/"
    fallback="Loading data..."
  >
    <MyComponent />
  </MyService.Provider>
);
```

[![Edit suspense-service-inline-suspense](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-inline-suspense-tf37k)

</details>

<details>
<summary>Multiple Providers</summary>

```jsx
const MyComponent = () => {
  // Specify which Provider to use
  // by passing the optional id parameter
  const a = useService(MyService, 'a');
  const b = useService(MyService, 'b');

  return <pre>{JSON.stringify({ a, b }, null, 2)}</pre>;
};

const App = () => (
  // Identify each Provider with a key
  // by using the optional id prop
  <MyService.Provider request="people/1/" id="a">
    <MyService.Provider request="people/2/" id="b">
      <Suspense fallback="Loading data...">
        <MyComponent />
      </Suspense>
    </MyService.Provider>
  </MyService.Provider>
);
```

[![Edit suspense-service-multiple-providers](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-multiple-providers-0o60m)

</details>

<details>
<summary>Multiple Consumers</summary>

```jsx
const MyComponent = () => (
  // Specify which Provider to use
  // by passing the optional id parameter
  <MyService.Consumer id="a">
    {(a) => (
      <MyService.Consumer id="b">
        {(b) => <pre>{JSON.stringify({ a, b }, null, 2)}</pre>}
      </MyService.Consumer>
    )}
  </MyService.Consumer>
);
```

[![Edit suspense-service-multiple-consumers](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-multiple-consumers-09ksg)

</details>

<details>
<summary>Pagination</summary>

```jsx
const MyComponent = () => {
  // Allows MyComponent to update MyService.Provider request
  const [response, setRequest] = useServiceState(MyService);
  const { previous: prev, next, results } = response;
  const setPage = (page) => setRequest(page.replace(/^http:/, 'https:'));

  return (
    <>
      <button disabled={!prev} onClick={() => setPage(prev)}>
        Previous
      </button>
      <button disabled={!next} onClick={() => setPage(next)}>
        Next
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.url}>
            <a href={result.url} target="_blank" rel="noreferrer">
              {result.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
```

[![Edit suspense-service-pagination](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-pagination-v9so8)

</details>

<details>
<summary>Transitions</summary>

> Note that [Concurrent Mode] is required in order to enable [Transitions].

```jsx
const MyComponent = () => {
  // Allows MyComponent to update MyService.Provider request
  const [response, setRequest] = useServiceState(MyService);
  // Renders current response while next response is suspended
  const [startTransition, isPending] = unstable_useTransition();
  const { previous: prev, next, results } = response;
  const setPage = (page) => {
    startTransition(() => {
      setRequest(page.replace(/^http:/, 'https:'));
    });
  };

  return (
    <>
      <button disabled={!prev || isPending} onClick={() => setPage(prev)}>
        Previous
      </button>{' '}
      <button disabled={!next || isPending} onClick={() => setPage(next)}>
        Next
      </button>
      {isPending && 'Loading next page...'}
      <ul>
        {results.map((result) => (
          <li key={result.url}>
            <a href={result.url} target="_blank" rel="noreferrer">
              {result.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
```

[![Edit suspense-service-transitions](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/suspense-service-transitions-9h8tv)

</details>

## Documentation

API Reference available on [GitHub Pages]

## Code Coverage

Available on [Codecov](https://codecov.io/gh/patrickroberts/suspense-service)

[Suspense]: https://reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly
[React]: https://reactjs.org
[Context]: https://reactjs.org/docs/context.html
[Rules of Hooks]: https://reactjs.org/docs/hooks-rules.html
[Concurrent Mode]: https://reactjs.org/docs/concurrent-mode-reference.html
[Transitions]: https://reactjs.org/docs/concurrent-mode-patterns.html#transitions
[Deferring a value]: https://reactjs.org/docs/concurrent-mode-patterns.html#deferring-a-value
[npm]: https://www.npmjs.com/package/suspense-service
[Yarn]: https://yarnpkg.com/package/suspense-service
[GitHub Pages]: https://patrickroberts.github.io/suspense-service
