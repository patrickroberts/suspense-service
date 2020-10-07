import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Id from '../Context/Id';

/** @ignore */
type Callbacks<TResponse> = Required<Parameters<Promise<TResponse>['then']>>;

export default interface Handler<TRequest, TResponse> {
  (request: TRequest, id: Id): PromiseLike<TResponse>;
}

/** @ignore */
export function createHook<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
): Handler<TRequest, TResponse> {
  return (request: TRequest, id: Id) => {
    const callbacks = useRef<Callbacks<TResponse>>();
    const factory = useCallback(
      () => new Promise<TResponse>((resolve, reject) => {
        callbacks.current = [resolve, reject];
      }),
      [callbacks],
    );
    const [promise, setPromise] = useState(factory);

    useEffect(() => {
      const [resolve, reject] = callbacks.current!;

      handler(request, id).then(resolve, reject);

      return () => setPromise(factory);
    }, [request, id, callbacks, factory, setPromise]);

    return promise;
  };
}
