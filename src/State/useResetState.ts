import { Dispatch, SetStateAction } from 'react';
import Reset, { defaultReset } from './Reset';
import useResetReducer from './useResetReducer';

/** @ignore */
// eslint-disable-next-line no-undef
function isFunction<S>(setStateAction: SetStateAction<S>): setStateAction is (prevState: S) => S {
  return typeof setStateAction === 'function';
}

/**
 * @ignore
 * An extension of React useState that is sensitive to initialState.
 * Intended to accept the return value of
 * {@link useIdContext} or {@link useService} as initialState.
 * @param initialState the initial state
 * @param reset the reset function when initialState updates
 */
export default function useResetState<S>(
  initialState: S, reset: Reset<S> = defaultReset,
): [S, Dispatch<SetStateAction<S>>] {
  return useResetReducer((prevState: S, setStateAction: SetStateAction<S>) => (
    isFunction(setStateAction) ? setStateAction(prevState) : setStateAction
  ), initialState, reset);
}
