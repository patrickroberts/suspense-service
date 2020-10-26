import { Dispatch, SetStateAction } from 'react';
import Reset from './Reset';
import useReducer from './useReducer';

/** @ignore */
// eslint-disable-next-line no-undef
function isUpdater<S>(setStateAction: SetStateAction<S>): setStateAction is (prevState: S) => S {
  return typeof setStateAction === 'function';
}

export default function useState<S>(
  initialState: S, reset?: Reset<S>,
): [S, Dispatch<SetStateAction<S>>] {
  return useReducer((prevState: S, setStateAction: SetStateAction<S>) => (
    isUpdater(setStateAction) ? setStateAction(prevState) : setStateAction
  ), initialState, reset);
}
