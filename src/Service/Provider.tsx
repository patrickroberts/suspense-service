import React, {
  ComponentType, ReactNode, Suspense, isValidElement, memo, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from '../Context/Id';
import Context from '../Context/index';
import Handler, { createHook } from './Handler';
import Resource, { useResource } from './Resource';

interface ServiceProviderProps<TRequest> {
  /**
   * A request passed to `useHandler()` for fetching an asynchronous resource.
   */
  value: TRequest;
  /**
   * A key that allows nested Providers to be consumed
   * @default null
   */
  id?: Id;
  children?: ReactNode;
  /**
   * A fallback to render if any children are suspended.
   * If the fallback is `null`, `undefined`, or omitted, then a Suspense
   * component must be inserted elsewhere between the Provider and Consumer.
   * @default null
   */
  fallback?: NonNullable<ReactNode> | null;
}

type ServiceProvider<TRequest> = ComponentType<ServiceProviderProps<TRequest>>;

export default ServiceProvider;

/** @ignore */
const propTypes = {
  // typechecking PropTypes.any against TRequest fails due to
  // the way WeakValidationMap<TRequest> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypesId,
  children: PropTypes.node,
  fallback: PropTypes.node,
};

/** @ignore */
const defaultProps = {
  id: null,
  children: null,
  fallback: null,
};

/** @ignore */
export function createProvider<TRequest, TResponse>(
  { Provider }: Context<Resource<TResponse>>,
  handler: Handler<TRequest, TResponse>,
): ServiceProvider<TRequest> {
  const useHandler = createHook(handler);
  const ResourceProvider: ServiceProvider<TRequest> = ({
    value, id = null, children, fallback,
  }) => {
    const thenable = useHandler(value, id);
    const resource = useResource(thenable);
    const element = useMemo(() => (
      isValidElement(fallback)
        ? <Suspense fallback={fallback}>{children}</Suspense>
        : <>{children}</>
    ), [children, fallback]);

    return useMemo(() => (
      <Provider value={resource} id={id}>{element}</Provider>
    ), [resource, id, element]);
  };

  ResourceProvider.propTypes = propTypes;
  ResourceProvider.defaultProps = defaultProps;

  return memo(ResourceProvider, (prev, next) => (
    Object.is(prev.value, next.value)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
    && Object.is(prev.fallback, next.fallback)
  ));
}
