import React, {
  ComponentType, ReactNode, memo, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from '../Context/Id';
import Context from '../Context/index';
import Resource from './Resource';

interface ServiceConsumerProps<TResponse> {
  /**
   * Which ServiceProvider to use
   * @default null
   */
  id?: Id;
  children: (value: TResponse) => ReactNode;
}

type ServiceConsumer<TResponse> = ComponentType<ServiceConsumerProps<TResponse>>;

export default ServiceConsumer;

/** @ignore */
const propTypes = {
  id: PropTypesId,
  children: PropTypes.func.isRequired,
};

/** @ignore */
const defaultProps = {
  id: null,
};

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

  ResourceConsumer.propTypes = propTypes;
  ResourceConsumer.defaultProps = defaultProps;

  return memo(ResourceConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
