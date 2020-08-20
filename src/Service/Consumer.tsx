import React, { FunctionComponent, ReactNode, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from '../Context/index';
import Resource from './Resource';

export interface ConsumerProps<TResponse> {
  id?: string | null;
  children: (value: TResponse) => ReactNode;
}

namespace Consumer {
  export type Props<TResponse> = ConsumerProps<TResponse>;
}

type Consumer<TResponse> = FunctionComponent<ConsumerProps<TResponse>>;

export default Consumer;

const propTypes = {
  id: PropTypes.string,
  children: PropTypes.func.isRequired
};

const defaultProps = {
  id: null
};

export function createConsumer<TResponse>(
  Context: Context<Resource<TResponse>>
): Consumer<TResponse> {
  const Consumer: FunctionComponent<ConsumerProps<TResponse>> = (
    { id, children }: ConsumerProps<TResponse>
  ) => {
    const render = useCallback((resource: Resource<TResponse>) => {
      const value = resource.read();

      return children(value);
    }, [children]);

    return useMemo(() => (
      <Context.Consumer id={id} children={render} />
    ), [id, render]);
  };

  Consumer.propTypes = propTypes;
  Consumer.defaultProps = defaultProps;

  return memo(Consumer, (prev, next) => (
    Object.is(prev.id, next.id) &&
    Object.is(prev.children, next.children)
  ));
}
