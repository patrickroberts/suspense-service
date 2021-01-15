import React, { ComponentType, memo, useMemo } from 'react';
import IdContext from '../../IdContext';
import useResetState from '../../State/useResetState';
import State from '../State';
import StateContextProviderProps, { defaultProps } from './Props';

type StateContextProvider<T> = ComponentType<StateContextProviderProps<T>>;

export default StateContextProvider;
export { StateContextProviderProps };

/** @ignore */
export function createStateContextProvider<T>(
  StateContext: IdContext<State<T>>,
): StateContextProvider<T> {
  const { Provider } = StateContext;
  const StateProvider: StateContextProvider<T> = ({ value, id, children, reset }) => {
    const state = useResetState(value, reset);

    return useMemo(() => (
      <Provider value={state} id={id}>{children}</Provider>
    ), [state, id, children]);
  };

  StateProvider.defaultProps = defaultProps;

  return memo(StateProvider, (prev, next) => (
    Object.is(prev.value, next.value)
    && Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
    && Object.is(prev.reset, next.reset)
  ));
}
