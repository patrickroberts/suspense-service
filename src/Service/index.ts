import { Dispatch, SetStateAction } from 'react';
import Id from '../IdContext/Id';
import IdContext, { createIdContext, useIdContext } from '../IdContext';
import Handler, { createUseHandler } from './Handler';
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
  [kResource]: IdContext<[() => TResponse, Dispatch<SetStateAction<TRequest>>]>;
}

export { Handler };

const defaultFn = () => { throw new Error('Provider is not in scope'); };
const defaultValue: [() => never, Dispatch<any>] = [defaultFn, defaultFn];

/**
 * Creates a Service Context for providing asynchronous data
 * @param handler the asynchronous function for fetching data
 */
export function createService<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
): Service<TRequest, TResponse> {
  const ResourceContext = createIdContext<[
    () => TResponse, Dispatch<SetStateAction<TRequest>>,
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
  service: Service<TRequest, TResponse>, id?: Id,
): [TResponse, Dispatch<SetStateAction<TRequest>>] {
  const { 0: resource, 1: setState } = useIdContext(service[kResource], id);

  return [resource(), setState];
}

/**
 * Synchronously consumes a response from a {@link ServiceProvider}
 * @param service the {@link Service} to use
 * @param id the {@link ServiceProviderProps.id | ServiceProvider id} to use
 */
export function useService<TResponse>(service: Service<any, TResponse>, id?: Id): TResponse {
  const { 0: response } = useServiceState(service, id);

  return response;
}
