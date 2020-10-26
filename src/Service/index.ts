import Id from '../Context/Id';
import Context, { createContext, useContext } from '../Context';
import Handler from './Handler';
import Resource from './Resource';
import ServiceConsumer, { createConsumer } from './Consumer';
import ServiceProvider, { createProvider } from './Provider';

/**
 * A privately scoped unique symbol for accessing Service internal Resource
 * @internal
 */
const kResource = Symbol('kResource');

/**
 * A Suspense integration for providing asynchronous data through a Context API
 */
export default interface Service<TRequest, TResponse> {
  Consumer: ServiceConsumer<TResponse>;
  Provider: ServiceProvider<TRequest>;
  /** @internal */
  [kResource]: Context<Resource<TResponse>>;
}

/**
 * Creates a Service Context for providing asynchronous data
 * @param handler the asynchronous function for fetching data
 */
export function createService<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
): Service<TRequest, TResponse> {
  const ResourceContext = createContext<Resource<TResponse>>(() => {
    throw new Error('Provider is not in scope');
  });

  return {
    Consumer: createConsumer(ResourceContext),
    Provider: createProvider(ResourceContext, handler),
    [kResource]: ResourceContext,
  };
}

/**
 * Synchronously consumes a response from a ServiceProvider
 * @param service the Service to use
 * @param id the ServiceProvider id to use
 */
export function useService<TResponse>(
  service: Service<any, TResponse>,
  id: Id = null,
): TResponse {
  const resource = useContext(service[kResource], id);

  return resource();
}
