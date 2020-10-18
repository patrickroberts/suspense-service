import { ReactNode } from 'react';
import Id from '../Id';

export default interface ContextProviderProps<T> {
  /**
   * A value to provide
   */
  value: T;
  /**
   * A key that allows nested Providers to be used
   * @default null
   */
  id?: Id;
  children?: ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
  children: null,
};
