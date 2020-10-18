import React, {
  ComponentType, memo, useCallback, useMemo,
} from 'react';
import Context from '../../Context';
import Resource from '../Resource';
import Props, { defaultProps } from './Props';

type ServiceConsumer<TResponse> = ComponentType<Props<TResponse>>;

export default ServiceConsumer;

/** @ignore */
export function createConsumer<TResponse>(
  { Consumer }: Context<Resource<TResponse>>,
): ServiceConsumer<TResponse> {
  const ResourceConsumer: ServiceConsumer<TResponse> = ({ id, children }) => {
    const render = useCallback((resource: Resource<TResponse>) => {
      const value = resource();

      return children(value);
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
