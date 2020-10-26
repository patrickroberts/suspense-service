import React, {
  ComponentType, Suspense, isValidElement, memo, useMemo,
} from 'react';
import Context from '../../Context/index';
import Handler from '../Handler';
import Resource from '../Resource';
import createUseHandler from '../createUseHandler';
import Props, { defaultProps } from './Props';

type ServiceProvider<TRequest> = ComponentType<Props<TRequest>>;

export default ServiceProvider;

/** @ignore */
export function createProvider<TRequest, TResponse>(
  { Provider }: Context<Resource<TResponse>>,
  handler: Handler<TRequest, TResponse>,
): ServiceProvider<TRequest> {
  const useHandler = createUseHandler(handler);
  const ResourceProvider: ServiceProvider<TRequest> = ({
    value, id, children, fallback,
  }) => {
    const resource = useHandler(value, id);
    const element = useMemo(() => (
      isValidElement(fallback)
        ? <Suspense fallback={fallback}>{children}</Suspense>
        : <>{children}</>
    ), [children, fallback]);

    return useMemo(() => (
      <Provider value={resource} id={id}>{element}</Provider>
    ), [resource, id, element]);
  };

  ResourceProvider.defaultProps = defaultProps;

  return memo(ResourceProvider, (prev, next) => (
    Object.is(prev.value, next.value)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
    && Object.is(prev.fallback, next.fallback)
  ));
}
