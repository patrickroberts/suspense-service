/**
 * The type of reset function when initialState updates
 */
type Reset<S> = (prevState: S, newInitialState: S) => S;

export default Reset;

/**
 * Resets the state with the value of the new initial state
 * @internal
 * @param prevState the previous state
 * @param newInitialState the new initial state
 */
export function defaultReset<S>(prevState: S, newInitialState: S): S {
  return newInitialState;
}
