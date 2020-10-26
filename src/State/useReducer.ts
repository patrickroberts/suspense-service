import {
  Dispatch, Reducer, ReducerAction, ReducerState, useRef,
} from 'react';
import Reset, { defaultReset } from './Reset';
import useForceUpdate from './useForceUpdate';

/**
 * An extension of React useReducer that is sensitive to initialState.
 * Intended to accept the return value of useContext or useService as initialState.
 * @param reducer the reducer function when dispatch is called
 * @param initialState the initial state
 * @param reset the reset function when initialState updates
 */
export default function useReducer<R extends Reducer<any, any>>(
  reducer: R, initialState: ReducerState<R>, reset: Reset<ReducerState<R>> = defaultReset,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const reducerRef = useRef(reducer);
  const initialStateRef = useRef(initialState);
  const resetRef = useRef(reset);
  const stateRef = useRef(initialState);

  if (!Object.is(initialStateRef.current, initialState)) {
    initialStateRef.current = initialState;
    stateRef.current = resetRef.current(stateRef.current, initialState);
  }

  const forceUpdate = useForceUpdate();
  const dispatchRef = useRef((action: ReducerAction<R>) => {
    stateRef.current = reducerRef.current(stateRef.current, action);
    forceUpdate();
  });

  return [stateRef.current, dispatchRef.current];
}
