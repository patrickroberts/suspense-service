import { Dispatch, SetStateAction } from 'react';
import Id from '../IdContext/Id';
import IdContext, { createIdContext, useIdContext } from '../IdContext';
import Handler, { createUseHandler } from './Handler';
import Resource from './Resource';
import ServiceConsumer, { createServiceConsumer } from './Consumer';
import ServiceProvider, { createServiceProvider } from './Provider';

/**
 * A privately scoped unique symbol for accessing {@link Service} internal {@link Resource}
 * @internal
 */
const kResource = Symbol('kResource');

/**
 * A Suspense integration for providing asynchronous data through a Context API
 */
export default interface Service<TRequest, TResponse> {
  Consumer: ServiceConsumer<TRequest, TResponse>;
  Provider: ServiceProvider<TRequest>;
  /** @internal */
  [kResource]: IdContext<[Resource<TResponse>, Dispatch<SetStateAction<TRequest>>]>;
}

const defaultFn = () => { throw new Error('Provider is not in scope'); };
const defaultValue: [Resource<never>, Dispatch<any>] = [defaultFn, defaultFn];

/**
 * Creates a Service Context for providing asynchronous data
 * @param handler the asynchronous function for fetching data
 */
export function createService<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
): Service<TRequest, TResponse> {
  const ResourceContext = createIdContext<[
    Resource<TResponse>, Dispatch<SetStateAction<TRequest>>
  ]>(defaultValue);

  return {
    Consumer: createServiceConsumer(ResourceContext),
    Provider: createServiceProvider(ResourceContext, createUseHandler(handler)),
    [kResource]: ResourceContext,
  };
}

/**
 * Synchronously consumes a stateful response from a {@link ServiceProvider}
 * @param service the {@link Service} to use
 * @param id the {@link ServiceProviderProps.id | ServiceProvider id} to use
 */
export function useServiceState<TRequest, TResponse>(
  service: Service<TRequest, TResponse>, id: Id = null,
): [TResponse, Dispatch<SetStateAction<TRequest>>] {
  const [resource, setState] = useIdContext(service[kResource], id);
  const response = resource();

  return [response, setState];
}

/**
 * Synchronously consumes a response from a {@link ServiceProvider}
 * @param service the {@link Service} to use
 * @param id the {@link ServiceProviderProps.id | ServiceProvider id} to use
 */
export function useService<TResponse>(service: Service<any, TResponse>, id: Id = null): TResponse {
  const [response] = useServiceState(service, id);

  return response;
}
