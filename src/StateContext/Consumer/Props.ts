import { Dispatch, ReactNode, SetStateAction } from 'react';
import Id from '../../IdContext/Id';

export default interface StateConsumerProps<T> {
  /**
   * The {@link StateProvider} to use
   * @default null
   */
  id?: Id;
  children: (value: T, setState: Dispatch<SetStateAction<T>>) => ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
};
