import React, {
  ComponentType, Context, ReactNode, memo, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Id, { PropTypesId } from './Id';
import Environment, { wrap } from './Environment';

interface ContextProviderProps<T> {
  /**
   * A value to provide
   */
  value: T;
  /**
   * A key that allows nested Providers to be used
   * @default null
   */
  id?: Id;
  children?: ReactNode;
}

type ContextProvider<T> = ComponentType<ContextProviderProps<T>>;

export default ContextProvider;

/** @ignore */
const propTypes = {
  // typechecking PropTypes.any against T fails due to
  // the way WeakValidationMap<T> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypesId,
  children: PropTypes.node,
};

/** @ignore */
const defaultProps = {
  id: null,
  children: null,
};

/** @ignore */
export function createProvider<T>(
  EnvironmentContext: Context<Environment<T>>,
): ContextProvider<T> {
  const Provider: ContextProvider<T> = ({ value, id = null, children }) => {
    const prev = useContext(EnvironmentContext);
    const next = useMemo(() => (
      wrap(prev, value, id)
    ), [value, id, prev]);

    return useMemo(() => (
      <EnvironmentContext.Provider value={next}>{children}</EnvironmentContext.Provider>
    ), [children, next]);
  };

  Provider.propTypes = propTypes;
  Provider.defaultProps = defaultProps;

  return memo(Provider, (prev, next) => (
    Object.is(prev.value, next.value)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
