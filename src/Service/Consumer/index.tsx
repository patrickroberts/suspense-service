import React, { ComponentType, Dispatch, SetStateAction, memo, useCallback, useMemo } from 'react';
import IdContext from '../../IdContext';
import Resource from '../Resource';
import ServiceConsumerProps, { defaultProps } from './Props';

type ServiceConsumer<TRequest, TResponse> =
  ComponentType<ServiceConsumerProps<TRequest, TResponse>>;

export default ServiceConsumer;
export { ServiceConsumerProps };

/** @ignore */
export function createServiceConsumer<TRequest, TResponse>(
  { Consumer }: IdContext<[Resource<TResponse>, Dispatch<SetStateAction<TRequest>>]>,
): ServiceConsumer<TRequest, TResponse> {
  const ResourceConsumer: ServiceConsumer<TRequest, TResponse> = ({ id, children }) => {
    const render = useCallback((
      resourceAndSetState: [Resource<TResponse>, Dispatch<SetStateAction<TRequest>>],
    ) => {
      const resource = resourceAndSetState[0];
      const setState = resourceAndSetState[1];
      const response = resource();

      return children(response, setState);
    }, [children]);

    return useMemo(() => (
      <Consumer id={id}>{render}</Consumer>
    ), [id, render]);
  };

  ResourceConsumer.defaultProps = defaultProps;

  return memo(ResourceConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
