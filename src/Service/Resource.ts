import { useMemo } from 'react';
import { useThenable } from './Thenable';

/** @ignore */
export default interface Resource<TResponse> {
  read(): TResponse;
}

/** @ignore */
export function useResource<TResponse>(
  thenable: PromiseLike<TResponse>
): Resource<TResponse> {
  const state = useThenable(thenable);

  return useMemo(() => ({
    read () {
      switch (state.status) {
        case 'pending': throw state.promise;
        case 'rejected': throw state.reason;
        case 'fulfilled': return state.value;
      }
    }
  }), [state]);
}
