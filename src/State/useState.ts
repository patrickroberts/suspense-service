import { Dispatch, SetStateAction } from 'react';
import Reset, { defaultReset } from './Reset';
import useReducer from './useReducer';

/** @ignore */
// eslint-disable-next-line no-undef
function isUpdater<S>(setStateAction: SetStateAction<S>): setStateAction is (prevState: S) => S {
  return typeof setStateAction === 'function';
}

/**
 * An extension of React useState that is sensitive to initialState.
 * Intended to accept the return value of useContext or useService as initialState.
 * @param initialState the initial state
 * @param reset the reset function when initialState updates
 */
export default function useState<S>(
  initialState: S, reset: Reset<S> = defaultReset,
): [S, Dispatch<SetStateAction<S>>] {
  return useReducer((prevState: S, setStateAction: SetStateAction<S>) => (
    isUpdater(setStateAction) ? setStateAction(prevState) : setStateAction
  ), initialState, reset);
}
