import { useMemo, useRef } from 'react';

/** @ignore */
interface PromiseStatePending {
  promise: Promise<void>;
  status: 'pending';
}

/** @ignore */
interface PromiseStateFulfilled<TResponse> {
  value: TResponse;
  status: 'fulfilled';
}

/** @ignore */
interface PromiseStateRejected {
  reason: any;
  status: 'rejected';
}

/** @ignore */
export type PromiseState<TResponse> =
  PromiseStatePending |
  PromiseStateFulfilled<TResponse> |
  PromiseStateRejected;

/** @ignore */
export function useThenable<TResponse>(
  thenable: PromiseLike<TResponse>
): PromiseState<TResponse> {
  const ref = useRef<PromiseState<TResponse>>();

  useMemo(() => {
    const promise = Promise.resolve(thenable).then(
      value => {
        const state = ref.current!;

        if (state.status === 'pending' && state.promise === promise) {
          ref.current = { value, status: 'fulfilled' };
        }
      },
      reason => {
        const state = ref.current!;

        if (state.status === 'pending' && state.promise === promise) {
          ref.current = { reason, status: 'rejected' };
        }
      }
    );

    ref.current = { promise, status: 'pending' };
  }, [thenable, ref]);

  return ref.current!;
}
