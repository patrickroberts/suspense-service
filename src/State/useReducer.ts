import {
  Dispatch, Reducer, ReducerAction, ReducerState, useRef,
} from 'react';
import Reset, { defaultReset } from './Reset';
import useForceUpdate from './useForceUpdate';

export default function useReducer<R extends Reducer<any, any>>(
  reducer: R, initialState: ReducerState<R>, reset?: Reset<ReducerState<R>>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const reducerRef = useRef(reducer);
  const initialStateRef = useRef(initialState);
  const resetRef = useRef(reset ?? defaultReset);
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
