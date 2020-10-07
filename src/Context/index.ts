import {
  Context as ReactContext,
  createContext as createReactContext,
  useContext as useReactContext,
} from 'react';
import Id from './Id';
import Environment, { unwrap } from './Environment';
import ContextConsumer, { createConsumer } from './Consumer';
import ContextProvider, { createProvider } from './Provider';

/**
 * A privately scoped unique symbol for accessing Context internal Environment
 * @internal
 */
const kEnvironment = Symbol('kEnvironment');

/**
 * A Context with support for multiple keyed values
 */
export default interface Context<T> {
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
  /** @internal */
  [kEnvironment]: ReactContext<Environment<T>>;
}

/**
 * Creates a keyed Context allowing multiple nested Providers to be accessible in the same scope
 * @param defaultValue the value consumed if no Provider is in scope and the consumer `id` is
 * `null`
 */
export function createContext<T>(defaultValue: T): Context<T> {
  const EnvironmentContext = createReactContext<Environment<T>>(
    new Map([[null, defaultValue]]),
  );

  return {
    Consumer: createConsumer(EnvironmentContext),
    Provider: createProvider(EnvironmentContext),
    [kEnvironment]: EnvironmentContext,
  };
}

/**
 * Consumes a value from a ContextProvider
 * @param context which Context to use
 * @param id which ContextProvider to use
 */
export function useContext<T>(
  context: Context<T>,
  id: Id = null,
): T {
  const env = useReactContext(context[kEnvironment]);

  return unwrap(env, id);
}
