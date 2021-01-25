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
  useHandler: (request: TRequest, id?: Id) => Resource<TResponse>,
): ServiceProvider<TRequest> {
  const ResourceProvider: ServiceProvider<TRequest> = ({
    request, id, children, fallback, reset,
  }) => {
    const stateAndSetState = useResetState(request, reset);
    const state = stateAndSetState[0];
    const setState = stateAndSetState[1];
    const resource = useHandler(state, id);
    const element = useMemo(() => (
      fallback != null
        ? <Suspense fallback={fallback}>{children}</Suspense>
        : children
    ), [children, fallback]);

    return useMemo(() => (
      <Provider value={[resource, setState]} id={id}>{element}</Provider>
    ), [resource, setState, id, element]);
  };

  ResourceProvider.defaultProps = defaultProps;

  return memo(ResourceProvider, (prev, next) => (
    Object.is(prev.request, next.request)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
    && Object.is(prev.fallback, next.fallback)
    && Object.is(prev.reset, next.reset)
  ));
}
