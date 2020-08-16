import { FunctionComponent, ReactNode, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from '../Context/index';
import Resource, { useResource } from './Resource';

export interface ProviderProps<TRequest> {
  value: TRequest;
  id?: string | null;
  children?: ReactNode;
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
  children: PropTypes.node
};

const defaultProps = {
  id: null,
  children: null
};

export function createProvider<TRequest, TResponse>(
  useHandler: (request: TRequest, id: string | null) => PromiseLike<TResponse>,
  Context: Context<Resource<TResponse>>
): Provider<TRequest> {
  const Provider: Provider<TRequest> = ({ value, id = null, children }) => {
    const thenable = useHandler(value, id);
    const resource = useResource(thenable);

    return useMemo(() => (
      <Context.Provider value={resource} id={id} children={children} />
    ), [resource, id, children]);
  };

  Provider.propTypes = propTypes;
  Provider.defaultProps = defaultProps;

  return memo(Provider, (prev, next) => (
    Object.is(prev.value, next.value) &&
    Object.is(prev.id, next.id) &&
    Object.is(prev.children, next.children)
  ));
}
