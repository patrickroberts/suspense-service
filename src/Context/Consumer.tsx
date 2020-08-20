import React, { Context, FunctionComponent, ReactNode, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Environment, { unwrap } from './Environment';

export interface ConsumerProps<T> {
  id?: string | null;
  children: (value: T) => ReactNode;
}

namespace Consumer {
  export type Props<T> = ConsumerProps<T>;
}

type Consumer<T> = FunctionComponent<ConsumerProps<T>>;

export default Consumer;

const propTypes = {
  id: PropTypes.string,
  children: PropTypes.func.isRequired
};

const defaultProps = {
  id: null
};

export function createConsumer<T>(
  Context: Context<Environment<T>>
): Consumer<T> {
  const Consumer: Consumer<T> = ({ id = null, children }) => {
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
