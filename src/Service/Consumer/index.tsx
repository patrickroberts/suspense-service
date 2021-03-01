import React, { ComponentType, Dispatch, SetStateAction, memo, useCallback, useMemo } from 'react';
import IdContext from '../../IdContext';
import ServiceConsumerProps, { defaultProps } from './Props';

type ServiceConsumer<TRequest, TResponse> =
  ComponentType<ServiceConsumerProps<TRequest, TResponse>>;

export default ServiceConsumer;
export { ServiceConsumerProps };

/** @ignore */
export function createServiceConsumer<TRequest, TResponse>(
  { Consumer }: IdContext<[() => TResponse, Dispatch<SetStateAction<TRequest>>]>,
): ServiceConsumer<TRequest, TResponse> {
  const ResourceConsumer: ServiceConsumer<TRequest, TResponse> = ({ id, children }) => {
    const render = useCallback((
      resourceAndSetState: [() => TResponse, Dispatch<SetStateAction<TRequest>>],
    ) => children(resourceAndSetState[0](), resourceAndSetState[1]),
    [children]);

    return useMemo(
      () => <Consumer id={id}>{render}</Consumer>,
      [id, render],
    );
  };

  ResourceConsumer.defaultProps = defaultProps;

  return memo(ResourceConsumer);
}
