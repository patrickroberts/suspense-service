import { ReactNode } from 'react';
import Id from '../Id';

export default interface ContextConsumerProps<T> {
  /**
   * Which ContextProvider to use
   * @default null
   */
  id?: Id;
  children: (value: T) => ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
};
