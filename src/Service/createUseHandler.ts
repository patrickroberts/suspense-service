import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Id from '../Context/Id';
import Handler from './Handler';
import Resource from './Resource';
import useResource from './useResource';

/** @ignore */
type Callbacks<TResponse> = Required<Parameters<Promise<TResponse>['then']>>;

/** @ignore */
export default function createUseHandler<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
) {
  return (request: TRequest, id: Id): Resource<TResponse> => {
    const ref = useRef<Callbacks<TResponse>>();
    const createPromise = useCallback(() => (
      new Promise<TResponse>((resolve, reject) => {
        ref.current = [resolve, reject];
      })
    ), []);
    const [promise, setPromise] = useState(createPromise);
    const resource = useResource(promise);

    useEffect(() => {
      const [onfulfilled, onrejected] = ref.current!;

      handler(request, id).then(onfulfilled, onrejected);

      return () => setPromise(createPromise);
    }, [request, id, createPromise]);

    return resource;
  };
}
