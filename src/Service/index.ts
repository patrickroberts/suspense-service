import Context, { createContext, useContext } from '../Context/index';
import Resource from './Resource';
import Consumer, { createConsumer } from './Consumer';
import Provider, { createProvider } from './Provider';

const kContext = Symbol();

export default interface Service<TRequest, TResponse> {
  Consumer: Consumer<TResponse>;
  Provider: Provider<TRequest>;
  [kContext]: Context<Resource<TResponse>>;
}

export function createService<TRequest, TResponse>(
  useHandler: (request: TRequest) => PromiseLike<TResponse>
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
  id: string | null = null
): TResponse {
  const resource = useContext(Service[kContext], id);

  return resource.read();
}
