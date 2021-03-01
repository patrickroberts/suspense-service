import Id from '../IdContext/Id';

/** @ignore */
const enum MutableProperty {
  CurrentRequest,
  CurrentId,
  Resolve,
  Resource
}

/** @ignore */
interface Mutable<TRequest, TResponse> {
  [MutableProperty.CurrentRequest]: TRequest;
  [MutableProperty.CurrentId]: Id;
  [MutableProperty.Resolve]: (value: TResponse | PromiseLike<TResponse>) => void;
  [MutableProperty.Resource]: () => TResponse;
}

export { Mutable as default, MutableProperty };
