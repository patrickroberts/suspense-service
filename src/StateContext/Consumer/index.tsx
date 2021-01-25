import React, { ComponentType, memo, useCallback, useMemo } from 'react';
import IdContext from '../../IdContext';
import State from '../State';
import StateContextConsumerProps, { defaultProps } from './Props';

type StateContextConsumer<T> = ComponentType<StateContextConsumerProps<T>>;

export default StateContextConsumer;
export { StateContextConsumerProps };

/** @ignore */
export function createStateContextConsumer<T>(
  { Consumer }: IdContext<State<T>>,
): StateContextConsumer<T> {
  const StateConsumer: StateContextConsumer<T> = ({ id, children }) => {
    const render = useCallback(
      (stateAndSetState: State<T>) => {
        const state = stateAndSetState[0];
        const setState = stateAndSetState[1];

        return children(state, setState);
      },
      [children],
    );

    return useMemo(() => (
      <Consumer id={id}>{render}</Consumer>
    ), [id, render]);
  };

  StateConsumer.defaultProps = defaultProps;

  return memo(StateConsumer, (prev, next) => (
    Object.is(prev.id, next.id)
    && Object.is(prev.children, next.children)
  ));
}
