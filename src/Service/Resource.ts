import { useCallback } from 'react';
import useThenable from './useThenable';

/** @internal */
type Resource<TResponse> = () => TResponse;

export default Resource;

/** @ignore */
export function useResource<TResponse>(
  thenable: PromiseLike<TResponse>,
): Resource<TResponse> {
  const ref = useThenable(thenable);
  const resource = useCallback(() => {
    const state = ref.current!;
    const { status } = state;

    switch (state.status) {
      case 'pending': throw state.promise;
      case 'rejected': throw state.reason;
      case 'fulfilled': return state.value;
      default: throw new Error(`Unexpected status ${status}`);
    }
  }, [ref]);

  return resource;
}
