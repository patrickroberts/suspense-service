import { ReactNode } from 'react';
import Id from '../../Context/Id';

export default interface ServiceConsumerProps<TResponse> {
  /**
   * Which ServiceProvider to use
   * @default null
   */
  id?: Id;
  children: (value: TResponse) => ReactNode;
}

/** @ignore */
export const defaultProps = {
  id: null,
};
