import React, { Context, FunctionComponent, ReactNode, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from './Id';
import Environment, { unwrap } from './Environment';

interface ContextConsumerProps<T> {
  id?: Id;
  children: (value: T) => ReactNode;
}

type ContextConsumer<T> = FunctionComponent<ContextConsumerProps<T>>;

export default ContextConsumer;

/** @ignore */
const propTypes = {
  id: PropTypesId,
  children: PropTypes.func.isRequired
};

/** @ignore */
const defaultProps = {
  id: null
};

/** @ignore */
export function createConsumer<T>(
  Context: Context<Environment<T>>
): ContextConsumer<T> {
  const Consumer: ContextConsumer<T> = ({ id = null, children }) => {
    const render = useCallback((env: Environment<T>) => {
      const value = unwrap(env, id);

      return children(value);
    }, [id, children]);

    return useMemo(() => (
      <Context.Consumer children={render} />
    ), [render]);
  };

  Consumer.propTypes = propTypes;
  Consumer.defaultProps = defaultProps;

  return memo(Consumer, (prev, next) => (
    Object.is(prev.id, next.id) &&
    Object.is(prev.children, next.children)
  ));
}
