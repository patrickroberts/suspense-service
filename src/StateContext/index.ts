import Id from '../IdContext/Id';
import State from './State';
import IdContext, { createIdContext, useIdContext } from '../IdContext';
import StateContextConsumer, { createStateContextConsumer } from './Consumer';
import StateContextProvider, { createStateContextProvider } from './Provider';

/**
 * A privately scoped unique symbol for accessing {@link StateContext} internal {@link State}
 * @internal
 */
const kState = Symbol('kState');

/**
 * A State Context with support for multiple keyed values
 */
export default interface StateContext<T> {
  Consumer: StateContextConsumer<T>;
  Provider: StateContextProvider<T>;
  /** @internal */
  [kState]: IdContext<State<T>>;
}

/**
 * Creates a State Context for providing a stateful value and a function to update it.
 * @param defaultValue the value consumed if no {@link StateContextProvider} is in scope and the
 * {@link StateContextConsumerProps.id | consumer `id`} is `null`
 */
export function createStateContext<T>(defaultValue: T): StateContext<T> {
  const StateContext = createIdContext<State<T>>(
    [defaultValue, () => undefined],
  );

  return {
    Consumer: createStateContextConsumer(StateContext),
    Provider: createStateContextProvider(StateContext),
    [kState]: StateContext,
  };
}

/**
 * Consumes a stateful value from a {@link StateContextProvider}, and a function to update it
 * @param context the {@link StateContext} to use
 * @param id the {@link StateContextProviderProps.id | StateContextProvider id} to use
 */
export function useStateContext<T>(context: StateContext<T>, id: Id = null): State<T> {
  return useIdContext(context[kState], id);
}
