import { Dispatch, Reducer, ReducerAction, ReducerState, useRef } from 'react';
import Reset, { defaultReset } from './Reset';
import useForceUpdate from './useForceUpdate';

/**
 * @ignore
 * An extension of React useReducer that is sensitive to initialState.
 * Intended to accept the return value of
 * {@link useIdContext} or {@link useService} as initialState.
 * @param reducer the reducer function when dispatch is called
 * @param initialState the initial state
 * @param reset the reset function when initialState updates
 */
export default function useResetReducer<R extends Reducer<any, any>>(
  reducer: R, initialState: ReducerState<R>, reset: Reset<ReducerState<R>> = defaultReset,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const forceUpdate = useForceUpdate();
  const { current } = useRef({
    reducer,
    initialState,
    state: initialState,
    dispatch: (action: ReducerAction<R>) => {
      current.state = current.reducer(current.state, action);
      forceUpdate();
    },
  });

  current.reducer = reducer;

  if (!Object.is(current.initialState, initialState)) {
    current.initialState = initialState;
    current.state = reset(current.state, initialState);
  }

  return [current.state, current.dispatch];
}
