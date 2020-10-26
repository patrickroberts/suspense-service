import { DispatchWithoutAction, useRef, useState } from 'react';

/** @internal */
export default function useForceUpdate(): DispatchWithoutAction {
  const [, dispatch] = useState({});
  const dispatchRef = useRef(() => dispatch({}));

  return dispatchRef.current;
}
