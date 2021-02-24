import React, { ComponentType, Context, memo, useContext, useMemo } from 'react';
import Environment, { wrap } from '../Environment';
import IdContextProviderProps, { defaultProps } from './Props';

type IdContextProvider<T> = ComponentType<IdContextProviderProps<T>>;

export default IdContextProvider;
export { IdContextProviderProps };

/** @ignore */
export function createIdContextProvider<T>(
  EnvironmentContext: Context<Environment<T>>,
): IdContextProvider<T> {
  const { Provider } = EnvironmentContext;
  const EnvironmentProvider: IdContextProvider<T> = ({ value, id, children }) => {
    const prev = useContext(EnvironmentContext);
    const next = useMemo(
      () => wrap(prev, value, id!),
      [value, id, prev],
    );

    return useMemo(
      () => <Provider value={next}>{children}</Provider>,
      [children, next],
    );
  };

  EnvironmentProvider.defaultProps = defaultProps;

  return memo(EnvironmentProvider);
}
