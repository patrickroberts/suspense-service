import React, { Fragment, FunctionComponent, ReactNode, Suspense, isValidElement, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from '../Context/Id';
import Context from '../Context/index';
import Resource, { useResource } from './Resource';

interface ServiceProviderProps<TRequest> {
  value: TRequest;
  id?: Id;
  children?: ReactNode;
  fallback?: NonNullable<ReactNode> | null;
}

type ServiceProvider<TRequest> = FunctionComponent<ServiceProviderProps<TRequest>>;

export default ServiceProvider;

/** @ignore */
const propTypes = {
  // typechecking PropTypes.any against TRequest fails due to
  // the way WeakValidationMap<TRequest> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypesId,
  children: PropTypes.node,
  fallback: PropTypes.node
};

/** @ignore */
const defaultProps = {
  id: null,
  children: null,
  fallback: null
};

/** @ignore */
export function createProvider<TRequest, TResponse>(
  Context: Context<Resource<TResponse>>,
  useHandler: (request: TRequest, id: Id) => PromiseLike<TResponse>
): ServiceProvider<TRequest> {
  const Provider: ServiceProvider<TRequest> = ({ value, id = null, children, fallback }) => {
    const thenable = useHandler(value, id);
    const resource = useResource(thenable);
    const element = useMemo(() => (
      isValidElement(fallback)
      ? <Suspense children={children} fallback={fallback} />
      : <Fragment children={children} />
    ), [children, fallback]);

    return useMemo(() => (
      <Context.Provider value={resource} id={id} children={element} />
    ), [resource, id, element]);
  };

  Provider.propTypes = propTypes;
  Provider.defaultProps = defaultProps;

  return memo(Provider, (prev, next) => (
    Object.is(prev.value, next.value) &&
    Object.is(prev.id, next.id) &&
    Object.is(prev.children, next.children) &&
    Object.is(prev.fallback, next.fallback)
  ));
}
