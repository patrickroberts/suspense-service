/**
 * The type of reset function when initialState updates
 */
type Reset<S> = (prevState: S, newInitialState: S) => S;

export default Reset;
