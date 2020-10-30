import { ReactNode } from 'react';
import Id from '../Id';

export default interface IdContextProviderProps<T> {
  /**
   * The value to provide
   */
  value: T;
  /**
   * The key that identifies the {@link IdContextProvider} to be consumed
   * @default null
   */
  id?: Id;
  /**
   * @default null
   */
  children?: ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
  children: null,
};
