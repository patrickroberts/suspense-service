import { MutableRefObject, useMemo, useRef } from 'react';
import PromiseState from './PromiseState';

/** @ignore */
type RefObject<T> = MutableRefObject<T | undefined>;

/** @ignore */
export default function useThenable<TResponse>(
  thenable: PromiseLike<TResponse>,
): RefObject<PromiseState<TResponse>> {
  const ref = useRef<PromiseState<TResponse>>();

  useMemo(() => {
    const promise = Promise.resolve(thenable).then(
      (value) => {
        const state = ref.current!;

        if (state.status === 'pending' && state.promise === promise) {
          ref.current = { value, status: 'fulfilled' };
        }

        return value;
      },
      (reason) => {
        const state = ref.current!;

        if (state.status === 'pending' && state.promise === promise) {
          ref.current = { reason, status: 'rejected' };
        }

        throw reason;
      },
    );

    ref.current = { promise, status: 'pending' };
  }, [thenable]);

  return ref;
}
