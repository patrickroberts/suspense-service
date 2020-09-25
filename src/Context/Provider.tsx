import React, { Context, FunctionComponent, ReactNode, memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Environment, { wrap } from './Environment';

interface ContextProviderProps<T> {
  value: T;
  id?: string | null;
  children?: ReactNode;
}

type ContextProvider<T> = FunctionComponent<ContextProviderProps<T>>;

export default ContextProvider;

/** @ignore */
const propTypes = {
  // typechecking PropTypes.any against T fails due to
  // the way WeakValidationMap<T> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypes.string,
  children: PropTypes.node
};

/** @ignore */
const defaultProps = {
  id: null,
  children: null
};

/** @ignore */
export function createProvider<T>(
  Context: Context<Environment<T>>
): ContextProvider<T> {
  const Provider: ContextProvider<T> = ({ value, id = null, children }) => {
    const prev = useContext(Context);
    const next = useMemo(() => (
      wrap(prev, value, id)
    ), [value, id, prev]);

    return useMemo(() => (
      <Context.Provider value={next} children={children} />
    ), [children, next]);
  };

  Provider.propTypes = propTypes;
  Provider.defaultProps = defaultProps;

  return memo(Provider, (prev, next) => (
    Object.is(prev.value, next.value) &&
    Object.is(prev.id, next.id) &&
    Object.is(prev.children, next.children)
  ));
}
