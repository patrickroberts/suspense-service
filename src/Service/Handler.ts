import { useRef } from 'react';
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
    const ref = useRef<HandlerState<TRequest, TResponse>>();
    let handlerState = ref.current;

    if (
      !handlerState
      || !Object.is(request, handlerState[HandlerStateProperty.CurrentRequest])
      || !Object.is(id, handlerState[HandlerStateProperty.CurrentId])
    ) {
      let promiseState: PromiseState<TResponse> = [
        StatusType.Pending, Promise.resolve(handler(request, id)).then(
          (value) => {
            promiseState = [StatusType.Fulfilled, value];
            return value;
          },
          (reason) => {
            promiseState = [StatusType.Rejected, reason];
            throw reason;
          },
        ),
      ];

      handlerState = [request, id, () => {
        if (promiseState[PromiseStateProperty.Status] !== StatusType.Fulfilled) {
          throw promiseState[PromiseStateProperty.Result];
        }

        return promiseState[PromiseStateProperty.Result];
      }];
      ref.current = handlerState;
    }

    return handlerState[HandlerStateProperty.Resource];
  };
}
