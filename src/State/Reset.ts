/**
 * The type for reset function when initialState updates
 */
type Reset<T> = (prevState: T, newInitialState: T) => T;

export default Reset;

/**
 * Resets the state with the value of the new initial state
 * @internal
 * @param prevState the previous state
 * @param newInitialState the new initial state
 */
export const defaultReset: Reset<any> = (prevState, newInitialState) => newInitialState;
