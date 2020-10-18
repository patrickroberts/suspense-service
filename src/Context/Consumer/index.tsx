import React, {
  Context, ComponentType, memo, useCallback, useMemo,
} from 'react';
import Environment, { unwrap } from '../Environment';
import Props, { defaultProps } from './Props';

type ContextConsumer<T> = ComponentType<Props<T>>;

export default ContextConsumer;

/** @ignore */
export function createConsumer<T>(
  { Consumer }: Context<Environment<T>>,
): ContextConsumer<T> {
  const EnvironmentConsumer: ContextConsumer<T> = ({ id = null, children }) => {
    const render = useCallback((env: Environment<T>) => {
      const value = unwrap(env, id);

      return children(value);
    }, [id, children]);

    return useMemo(() => (
      <Consumer>{render}</Consumer>
    ), [render]);
  };

  EnvironmentConsumer.defaultProps = defaultProps;

  return memo(EnvironmentConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
