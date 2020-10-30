/**
 * The type of reset function when initialState updates
 */
type Reset<S> = (prevState: S, newInitialState: S) => S;

export default Reset;

/** @ignore */
export function defaultReset<S>(_: S, newInitialState: S): S {
  return newInitialState;
}
