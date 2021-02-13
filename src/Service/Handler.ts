import Id from '../IdContext/Id';
import useSync from '../State/useSync';
import PromiseState from './PromiseState';
import Resource from './Resource';
import Status from './Status';

/**
 * The type of asynchronous function for fetching data
 */
type Handler<TRequest, TResponse> = (request: TRequest, id: Id) => PromiseLike<TResponse>;

export default Handler;

/** @ignore */
export function createUseHandler<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
) {
  return function useHandler(request: TRequest, id: Id = null): Resource<TResponse> {
    return useSync(() => {
      let state: PromiseState<TResponse>;
      const promise = Promise.resolve(handler(request, id)).then(
        (value) => {
          state = { value, status: Status.Fulfilled };
          return value;
        },
        (reason) => {
          state = { reason, status: Status.Rejected };
          throw reason;
        },
      );

      state = { promise, status: Status.Pending };
      return () => {
        switch (state.status) {
          case Status.Pending: throw state.promise;
          case Status.Fulfilled: return state.value;
          default: throw state.reason;
        }
      };
    }, [request, id]);
  };
}
