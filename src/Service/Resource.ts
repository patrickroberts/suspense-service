import { useCallback } from 'react';
import { useThenable } from './Thenable';

/** @internal */
export default interface Resource<TResponse> {
  (): TResponse;
}

/** @ignore */
export function useResource<TResponse>(
  thenable: PromiseLike<TResponse>,
): Resource<TResponse> {
  const ref = useThenable(thenable);

  return useCallback(() => {
    const state = ref.current!;
    const { status } = state;

    switch (state.status) {
      case 'pending': throw state.promise;
      case 'rejected': throw state.reason;
      case 'fulfilled': return state.value;
      default: throw new Error(`Unexpected status ${status}`);
    }
  }, [ref]);
}
