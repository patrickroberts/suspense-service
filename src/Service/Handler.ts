import Id from '../IdContext/Id';
import useSync from '../State/useSync';
import PromiseState, { PromiseStateProperty, StatusType } from './PromiseState';
import Resource from './Resource';

/**
 * The type of asynchronous function for fetching data
 */
type Handler<TRequest, TResponse> = (request: TRequest, id: Id) => PromiseLike<TResponse>;

export default Handler;

/** @ignore */
export function createUseHandler<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
) {
  return function useHandler(request: TRequest, id: Id): Resource<TResponse> {
    return useSync(() => {
      let state: PromiseState<TResponse>;
      const promise = Promise.resolve(handler(request, id)).then(
        (value) => {
          state = [StatusType.Fulfilled, value];
          return value;
        },
        (reason) => {
          state = [StatusType.Rejected, reason];
          throw reason;
        },
      );

      state = [StatusType.Pending, promise];
      return () => {
        if (state[PromiseStateProperty.Status] !== StatusType.Fulfilled) {
          throw state[PromiseStateProperty.Result];
        }

        return state[PromiseStateProperty.Result];
      };
    }, [request, id]);
  };
}
