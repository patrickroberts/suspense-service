import React, { Fragment, FunctionComponent, ReactNode, Suspense, isValidElement, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from '../Context/index';
import Resource, { useResource } from './Resource';

export interface ProviderProps<TRequest> {
  value: TRequest;
  id?: string | null;
  children?: ReactNode;
  fallback?: NonNullable<ReactNode> | null;
}

namespace Provider {
  export type Props<TRequest> = ProviderProps<TRequest>;
}

type Provider<TRequest> = FunctionComponent<ProviderProps<TRequest>>;

export default Provider;

const propTypes = {
  // typechecking PropTypes.any against TRequest fails due to
  // the way WeakValidationMap<TRequest> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypes.string,
  children: PropTypes.node,
  fallback: PropTypes.node
};

const defaultProps = {
  id: null,
  children: null,
  fallback: null
};

export function createProvider<TRequest, TResponse>(
  Context: Context<Resource<TResponse>>,
  useHandler: (request: TRequest, id: string | null) => PromiseLike<TResponse>
): Provider<TRequest> {
  const Provider: Provider<TRequest> = ({ value, id = null, children, fallback }) => {
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
