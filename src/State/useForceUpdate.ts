import { DispatchWithoutAction, useReducer } from 'react';

const initialValue = {};

/** @ignore */
export default function useForceUpdate(): DispatchWithoutAction {
  const { 1: forceUpdate } = useReducer(() => ({}), initialValue);

  return forceUpdate;
}
