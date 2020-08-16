import {
  Context as ReactContext,
  createContext as createReactContext,
  useContext as useReactContext
} from 'react';
import Environment, { unwrap } from './Environment';
import Consumer, { createConsumer } from './Consumer';
import Provider, { createProvider } from './Provider';

const kContext = Symbol();

export default interface Context<T> {
  Consumer: Consumer<T>;
  Provider: Provider<T>;
  [kContext]: ReactContext<Environment<T>>;
}

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

export function useContext<T>(
  Context: Context<T>,
  id: string | null = null
): T {
  const env = useReactContext(Context[kContext]);

  return unwrap(env, id);
}
