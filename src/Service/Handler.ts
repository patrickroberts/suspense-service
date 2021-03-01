import { useState } from 'react';
import Id from '../IdContext/Id';
import HandlerState, { HandlerStateProperty } from './HandlerState';
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
    const factory = (): HandlerState<TRequest, TResponse> => {
      let state: PromiseState<TResponse> = [
        StatusType.Pending, Promise.resolve(handler(request, id)).then(
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

      return [request, id, () => {
        if (state[PromiseStateProperty.Status] !== StatusType.Fulfilled) {
          throw state[PromiseStateProperty.Result];
        }

        return state[PromiseStateProperty.Result];
      }];
    };
    const { 0: state, 1: setState } = useState<HandlerState<TRequest, TResponse>>(factory);
    let next = state;

    if (
      !Object.is(request, state[HandlerStateProperty.CurrentRequest])
      || !Object.is(id, state[HandlerStateProperty.CurrentId])
    ) {
      next = factory();
      setState(next);
    }

    return next[HandlerStateProperty.Resource];
  };
}
