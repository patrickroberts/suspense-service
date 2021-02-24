import React, { ComponentType, Dispatch, SetStateAction, Suspense, memo, useMemo } from 'react';
import Id from '../../IdContext/Id';
import IdContext from '../../IdContext';
import useResetState from '../../State/useResetState';
import Resource from '../Resource';
import ServiceProviderProps, { defaultProps } from './Props';

type ServiceProvider<TRequest> = ComponentType<ServiceProviderProps<TRequest>>;

export default ServiceProvider;
export { ServiceProviderProps };

/** @ignore */
export function createServiceProvider<TRequest, TResponse>(
  { Provider }: IdContext<[Resource<TResponse>, Dispatch<SetStateAction<TRequest>>]>,
  useHandler: (request: TRequest, id: Id) => Resource<TResponse>,
): ServiceProvider<TRequest> {
  const ResourceProvider: ServiceProvider<TRequest> = ({
    request, id, children, fallback, reset,
  }) => {
    const { 0: state, 1: setState } = useResetState(request, reset);
    const resource = useHandler(state, id!);
    const element = useMemo(
      () => (fallback == null ? children : <Suspense fallback={fallback}>{children}</Suspense>),
      [children, fallback],
    );

    return useMemo(
      () => <Provider value={[resource, setState]} id={id}>{element}</Provider>,
      [resource, setState, id, element],
    );
  };

  ResourceProvider.defaultProps = defaultProps;

  return memo(ResourceProvider);
}
