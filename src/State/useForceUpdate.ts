import { DispatchWithoutAction, useReducer } from 'react';

/** @ignore */
export default function useForceUpdate(): DispatchWithoutAction {
  const [, dispatch] = useReducer(() => ({}), {});
  return dispatch;
}
