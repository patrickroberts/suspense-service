type Reset<T> = (prevState: T, initialState: T) => T;

export default Reset;

/** @ignore */
export const defaultReset: Reset<any> = (_, initialState) => initialState;
