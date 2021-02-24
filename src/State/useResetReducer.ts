import { Dispatch, Reducer, ReducerAction, ReducerState, useRef } from 'react';
import Reset from './Reset';
import ResetReducer, { ResetReducerProperty } from './ResetReducer';
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
  reducer: R, initialState: ReducerState<R>, reset?: Reset<ReducerState<R>>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const forceUpdate = useForceUpdate();
  const { current } = useRef<ResetReducer<R>>([
    reducer,
    initialState,
    initialState,
    (action: ReducerAction<R>) => {
      const nextState = current[ResetReducerProperty.Reducer](
        current[ResetReducerProperty.State], action,
      );

      if (!Object.is(current[ResetReducerProperty.State], nextState)) {
        current[ResetReducerProperty.State] = nextState;
        forceUpdate();
      }
    },
  ]);

  current[ResetReducerProperty.Reducer] = reducer;

  if (!Object.is(current[ResetReducerProperty.InitialState], initialState)) {
    current[ResetReducerProperty.InitialState] = initialState;
    current[ResetReducerProperty.State] = reset
      ? reset(current[ResetReducerProperty.State], initialState)
      : initialState;
  }

  return [current[ResetReducerProperty.State], current[ResetReducerProperty.Dispatch]];
}
