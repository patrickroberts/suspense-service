import Id from '../Context/Id';
import Context, { createContext, useContext } from '../Context/index';
import Resource from './Resource';
import ServiceConsumer, { createConsumer } from './Consumer';
import ServiceProvider, { createProvider } from './Provider';

/** @ignore */
const kContext = Symbol();

export default interface Service<TRequest, TResponse> {
  Consumer: ServiceConsumer<TResponse>;
  Provider: ServiceProvider<TRequest>;
  /** @internal */
  [kContext]: Context<Resource<TResponse>>;
}

export function createService<TRequest, TResponse>(
  useHandler: (request: TRequest, id: Id) => PromiseLike<TResponse>
): Service<TRequest, TResponse> {
  const Context = createContext<Resource<TResponse>>({
    read () {
      throw new TypeError('Provider is not in scope');
    }
  });

  return {
    Consumer: createConsumer(Context),
    Provider: createProvider(Context, useHandler),
    [kContext]: Context
  };
}

export function useService<TResponse>(
  Service: Service<any, TResponse>,
  id: Id = null
): TResponse {
  const resource = useContext(Service[kContext], id);

  return resource.read();
}
