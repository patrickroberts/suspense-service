import { ReactNode } from 'react';
import Id from '../../IdContext/Id';
import Reset from '../../State/Reset';

export default interface ServiceProviderProps<TRequest> {
  /**
   * The request passed to {@link createService | handler} for fetching an asynchronous resource.
   */
  request: TRequest;
  /**
   * The key that identifies the {@link ServiceProvider} to be consumed
   * @default null
   */
  id?: Id;
  /**
   * @default null
   */
  children?: ReactNode;
  /**
   * The fallback to render if any children are suspended.
   * If the fallback is `null`, `undefined`, or omitted, then a Suspense
   * component must be inserted elsewhere between the
   * {@link ServiceProvider | Provider} and {@link ServiceConsumer | Consumer}.
   * @default null
   */
  fallback?: NonNullable<ReactNode> | null;
  /**
   * The reset function when {@link ServiceProviderProps.request | request} updates
   */
  reset?: Reset<TRequest>;
}

/** @ignore */
export const defaultProps = {
  id: null,
  children: null,
  fallback: null,
};
