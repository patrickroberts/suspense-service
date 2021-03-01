import { useEffect, useRef } from 'react';
import Id from '../IdContext/Id';
import Mutable, { MutableProperty } from './Mutable';
import PromiseState, { PromiseStateProperty, StatusType } from './PromiseState';

/**
 * The type of asynchronous function for fetching data
 */
type Handler<TRequest, TResponse> = (request: TRequest, id: Id) => PromiseLike<TResponse>;

export default Handler;

/** @ignore */
export function createUseHandler<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
) {
  return function useHandler(request: TRequest, id: Id): () => TResponse {
    const ref = useRef<Mutable<TRequest, TResponse>>();
    let mutable = ref.current;

    if (
      !mutable
      || !Object.is(request, mutable[MutableProperty.CurrentRequest])
      || !Object.is(id, mutable[MutableProperty.CurrentId])
    ) {
      let state: PromiseState<TResponse> = [
        StatusType.Pending,
        new Promise<TResponse>((resolve) => {
          mutable = [request, id, resolve, () => {
            if (state[PromiseStateProperty.Status] !== StatusType.Fulfilled) {
              throw state[PromiseStateProperty.Result];
            }

            return state[PromiseStateProperty.Result];
          }];
        }).then(
          (value) => {
            state = [StatusType.Fulfilled, value];
            return value;
          },
          (reason) => {
            state = [StatusType.Rejected, reason];
            throw reason;
          },
        ),
      ];

      ref.current = mutable;
    }

    useEffect(() => {
      const promise = handler(
        mutable![MutableProperty.CurrentRequest],
        mutable![MutableProperty.CurrentId],
      );

      mutable![MutableProperty.Resolve](promise);
    }, [mutable]);

    return mutable![MutableProperty.Resource];
  };
}
