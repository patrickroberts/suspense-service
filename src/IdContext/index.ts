import { Context, createContext, useContext } from 'react';
import Id from './Id';
import Environment, { unwrap } from './Environment';
import IdContextConsumer, { createIdContextConsumer } from './Consumer';
import IdContextProvider, { createIdContextProvider } from './Provider';

/**
 * A privately scoped unique symbol for accessing {@link IdContext} internal {@link Environment}
 * @internal
 */
const kEnvironment = Symbol('kEnvironment');

/**
 * A Context with support for multiple keyed values
 */
export default interface IdContext<T> {
  Consumer: IdContextConsumer<T>;
  Provider: IdContextProvider<T>;
  /** @internal */
  [kEnvironment]: Context<Environment<T>>;
}

/**
 * Creates a keyed Context allowing multiple nested Providers to be accessible in the same scope.
 * @param defaultValue the value consumed if no {@link IdContextProvider} is in scope and the
 * {@link IdContextConsumerProps.id | consumer `id`} is `null`
 */
export function createIdContext<T>(defaultValue: T): IdContext<T> {
  const EnvironmentContext = createContext<Environment<T>>(
    new Map([[null, defaultValue]]),
  );

  return {
    Consumer: createIdContextConsumer(EnvironmentContext),
    Provider: createIdContextProvider(EnvironmentContext),
    [kEnvironment]: EnvironmentContext,
  };
}

/**
 * Consumes a value from a {@link IdContextProvider}
 * @param context the {@link IdContext} to use
 * @param id the {@link IdContextProviderProps.id | IdContextProvider id} to use
 */
export function useIdContext<T>(context: IdContext<T>, id: Id = null): T {
  const env = useContext(context[kEnvironment]);

  return unwrap(env, id);
}
