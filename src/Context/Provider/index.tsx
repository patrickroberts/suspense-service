import React, {
  ComponentType, Context, memo, useContext, useMemo,
} from 'react';
import Environment, { wrap } from '../Environment';
import Props, { defaultProps } from './Props';

type ContextProvider<T> = ComponentType<Props<T>>;

export default ContextProvider;

/** @ignore */
export function createProvider<T>(
  EnvironmentContext: Context<Environment<T>>,
): ContextProvider<T> {
  const Provider: ContextProvider<T> = ({ value, id = null, children }) => {
    const prev = useContext(EnvironmentContext);
    const next = useMemo(() => (
      wrap(prev, value, id)
    ), [value, id, prev]);

    return useMemo(() => (
      <EnvironmentContext.Provider value={next}>{children}</EnvironmentContext.Provider>
    ), [children, next]);
  };

  Provider.defaultProps = defaultProps;

  return memo(Provider, (prev, next) => (
    Object.is(prev.value, next.value)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
