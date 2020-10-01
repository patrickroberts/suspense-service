import React, { FunctionComponent, ReactNode, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from '../Context/Id';
import Context from '../Context/index';
import Resource from './Resource';

interface ServiceConsumerProps<TResponse> {
  id?: Id;
  children: (value: TResponse) => ReactNode;
}

type ServiceConsumer<TResponse> = FunctionComponent<ServiceConsumerProps<TResponse>>;

export default ServiceConsumer;

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
export function createConsumer<TResponse>(
  Context: Context<Resource<TResponse>>
): ServiceConsumer<TResponse> {
  const Consumer: FunctionComponent<ServiceConsumerProps<TResponse>> = (
    { id, children }: ServiceConsumerProps<TResponse>
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
