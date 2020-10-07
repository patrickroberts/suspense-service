import React, {
  Context, ComponentType, ReactNode, memo, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from './Id';
import Environment, { unwrap } from './Environment';

interface ContextConsumerProps<T> {
  /**
   * Which ContextProvider to use
   * @default null
   */
  id?: Id;
  children: (value: T) => ReactNode;
}

type ContextConsumer<T> = ComponentType<ContextConsumerProps<T>>;

export default ContextConsumer;

/** @ignore */
const propTypes = {
  id: PropTypesId,
  children: PropTypes.func.isRequired,
};

/** @ignore */
const defaultProps = {
  id: null,
};

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

  EnvironmentConsumer.propTypes = propTypes;
  EnvironmentConsumer.defaultProps = defaultProps;

  return memo(EnvironmentConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
