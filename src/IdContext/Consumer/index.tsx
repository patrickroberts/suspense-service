import React, { Context, ComponentType, memo, useCallback, useMemo } from 'react';
import Environment, { unwrap } from '../Environment';
import IdContextConsumerProps, { defaultProps } from './Props';

type IdContextConsumer<T> = ComponentType<IdContextConsumerProps<T>>;

export default IdContextConsumer;
export { IdContextConsumerProps };

/** @ignore */
export function createIdContextConsumer<T>(
  { Consumer }: Context<Environment<T>>,
): IdContextConsumer<T> {
  const EnvironmentConsumer: IdContextConsumer<T> = ({ id, children }) => {
    const render = useCallback(
      (env: Environment<T>) => children(unwrap(env, id)),
      [id, children],
    );

    return useMemo(
      () => <Consumer>{render}</Consumer>,
      [render],
    );
  };

  EnvironmentConsumer.defaultProps = defaultProps;

  return memo(EnvironmentConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
