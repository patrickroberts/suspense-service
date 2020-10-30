import { Dispatch, ReactNode, SetStateAction } from 'react';
import Id from '../../IdContext/Id';

export default interface ServiceConsumerProps<TRequest, TResponse> {
  /**
   * The {@link ServiceProvider} to use
   * @default null
   */
  id?: Id;
  children: (value: TResponse, setState: Dispatch<SetStateAction<TRequest>>) => ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
};
