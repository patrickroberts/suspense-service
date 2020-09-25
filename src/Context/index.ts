import {
  Context as ReactContext,
  createContext as createReactContext,
  useContext as useReactContext
} from 'react';
import Environment, { unwrap } from './Environment';
import ContextConsumer, { createConsumer } from './Consumer';
import ContextProvider, { createProvider } from './Provider';

/** @ignore */
const kContext = Symbol();

export default interface Context<T> {
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
  /** @internal */
  [kContext]: ReactContext<Environment<T>>;
}

/**
 * Creates a keyed Context allowing multiple nested Providers to be used simultaneously
 * @param defaultValue - Used if no Provider is in scope and the requested `id` is `null`
 */
export function createContext<T>(defaultValue: T): Context<T> {
  const Context = createReactContext<Environment<T>>(
    new Map([[null, defaultValue]])
  );

  return {
    Consumer: createConsumer(Context),
    Provider: createProvider(Context),
    [kContext]: Context
  };
}

/**
 * Consumes a keyed Context
 * @param Context - Specifies which Context to use
 * @param id - Specifies which Provider to use
 */
export function useContext<T>(
  Context: Context<T>,
  id: string | null = null
): T {
  const env = useReactContext(Context[kContext]);

  return unwrap(env, id);
}
