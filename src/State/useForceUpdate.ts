import { DispatchWithoutAction, useReducer } from 'react';

/** @ignore */
export default function useForceUpdate(): DispatchWithoutAction {
  return useReducer(() => ({}), {})[1];
}
