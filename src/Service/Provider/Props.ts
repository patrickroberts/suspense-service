import { ReactNode } from 'react';
import Id from '../../Context/Id';

export default interface ServiceProviderProps<TRequest> {
  /**
   * A request passed to `useHandler()` for fetching an asynchronous resource.
   */
  value: TRequest;
  /**
   * A key that allows nested Providers to be consumed
   * @default null
   */
  id?: Id;
  children?: ReactNode;
  /**
   * A fallback to render if any children are suspended.
   * If the fallback is `null`, `undefined`, or omitted, then a Suspense
   * component must be inserted elsewhere between the Provider and Consumer.
   * @default null
   */
  fallback?: NonNullable<ReactNode> | null;
}

/** @ignore */
export const defaultProps = {
  id: null,
  children: null,
  fallback: null,
};
