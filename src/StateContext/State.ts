import { Dispatch, SetStateAction } from 'react';

/**
 * A stateful value and a function to update it
 */
type State<T> = [T, Dispatch<SetStateAction<T>>];

export default State;
