import { Context, FunctionComponent, ReactNode, memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Environment, { wrap } from './Environment';

export interface ProviderProps<T> {
  value: T;
  id?: string | null;
  children?: ReactNode;
}

namespace Provider {
  export type Props<T> = ProviderProps<T>;
}

type Provider<T> = FunctionComponent<ProviderProps<T>>;

export default Provider;

const propTypes = {
  // typechecking PropTypes.any against T fails due to
  // the way WeakValidationMap<T> works in @types/react
  value: PropTypes.any.isRequired as any,
  id: PropTypes.string,
  children: PropTypes.node
};

const defaultProps = {
  id: null,
  children: null
};

export function createProvider<T>(
  Context: Context<Environment<T>>
): Provider<T> {
  const Provider: Provider<T> = ({ value, id = null, children }) => {
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
