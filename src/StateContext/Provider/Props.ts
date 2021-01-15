import { ReactNode } from 'react';
import Id from '../../IdContext/Id';
import Reset from '../../State/Reset';

export default interface StateContextProviderProps<T> {
  /**
   * The initial value to provide
   */
  value: T;
  /**
   * The key that identifies the {@link StateContextProvider} to be consumed
   * @default null
   */
  id?: Id;
  /**
   * @default null
   */
  children?: ReactNode;
  /**
   * The reset function when {@link StateProviderProps.value | value} updates
   */
  reset?: Reset<T>;
}

/** @ignore */
export const defaultProps = {
  id: null,
  children: null,
};
