import Id from '../IdContext/Id';

/** @ignore */
const enum HandlerStateProperty {
  CurrentRequest,
  CurrentId,
  Resource
}

/** @ignore */
interface HandlerState<TRequest, TResponse> {
  [HandlerStateProperty.CurrentRequest]: TRequest;
  [HandlerStateProperty.CurrentId]: Id;
  [HandlerStateProperty.Resource]: () => TResponse;
}

export { HandlerState as default, HandlerStateProperty };
